import http from 'node:http'

// Carga .env si existe — built-in de Node (>=20.6), sin dependencia dotenv.
// No es un error si el archivo no existe (ej. en un entorno donde la key ya
// viene inyectada por el shell/CI).
try {
  process.loadEnvFile()
} catch {
  // .env no existe — seguimos, OPENAI_API_KEY puede venir de otro lado.
}

const PORT = process.env.PORT || 8787
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const MAX_BODY_BYTES = 8 * 1024 * 1024 // 8MB — suficiente para una foto de recibo en base64.
// Presupuesto total del scanner: 10s HARD LIMIT (frontend, ver scanReceipt.js).
// Este timeout debe ser MENOR que ese para que, en el caso normal, el backend ya
// haya abortado y respondido con un error ANTES de que el frontend tenga que
// abortar la conexión entera él mismo.
const OPENAI_TIMEOUT_MS = 7_500

// La API key SOLO vive acá (proceso backend). Nunca se envía al frontend, nunca
// se referencia desde código que corra en el navegador.
const OPENAI_MODEL = 'gpt-4o-mini'

const RECEIPT_SCHEMA = {
  type: 'object',
  properties: {
    amount: { type: ['number', 'null'], description: 'Monto total del recibo, sin símbolos de moneda.' },
    concept: { type: ['string', 'null'], description: 'Concepto o comercio principal del recibo.' },
    category: {
      type: ['string', 'null'],
      enum: ['Alojamiento', 'Alimentación', 'Transporte', 'Actividades', 'Compras', 'Otros', null],
      description: 'Categoría de gasto más apropiada.',
    },
    date: { type: ['string', 'null'], description: 'Fecha del recibo en formato ISO YYYY-MM-DD.' },
  },
  required: ['amount', 'concept', 'category', 'date'],
  additionalProperties: false,
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    let rejected = false
    const chunks = []
    req.on('data', (chunk) => {
      // Ya se decidió rechazar (body demasiado grande) — dejamos que el resto
      // de bytes entrantes se drene sin seguir bufferizando (memoria), pero NO
      // cortamos la conexión acá: eso es lo que hacía que Vite convirtiera el
      // 413 real en un 502 genérico (el proxy no llegaba a ver la respuesta).
      // El request se cierra recién en el handler del server, después de que
      // la respuesta 413 ya se haya enviado por completo.
      if (rejected) return
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        rejected = true
        chunks.length = 0
        reject(new HttpError(413, `La imagen es demasiado grande (máximo ${MAX_BODY_BYTES / 1024 / 1024}MB).`))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (rejected) return
      if (chunks.length === 0) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8')))
      } catch {
        reject(new HttpError(400, 'Body inválido: se esperaba JSON.'))
      }
    })
    req.on('error', (err) => {
      if (!rejected) reject(err)
    })
  })
}

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  })
  res.end(payload)
}

async function callOpenAiVision(imageDataUrl) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS)
  const startedAt = Date.now()

  let response
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Extraés datos estructurados de fotos de recibos/facturas de viaje. ' +
              'Si un campo no se puede determinar con confianza a partir de la imagen, devolvé null para ese campo — nunca inventes un valor.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extraé amount, concept, category y date de este recibo.' },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'receipt_data', schema: RECEIPT_SCHEMA, strict: true },
        },
      }),
      signal: controller.signal,
    })
  } catch (err) {
    // AbortError = disparó nuestro propio timeout, no un abort externo — nunca
    // dejamos la conexión (ni la respuesta al cliente) pendiente indefinidamente.
    if (err.name === 'AbortError') {
      throw new HttpError(504, `OpenAI tardó demasiado en responder (más de ${OPENAI_TIMEOUT_MS / 1000}s). Intenta de nuevo.`)
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
    console.info(`[scan-receipt] OpenAI fetch: ${Date.now() - startedAt}ms`)
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new HttpError(502, `OpenAI respondió con error (${response.status}): ${errorBody.slice(0, 300)}`)
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content
  if (!raw) throw new HttpError(502, 'OpenAI no devolvió contenido interpretable.')

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new HttpError(502, 'OpenAI devolvió un JSON inválido.')
  }

  return {
    amount: typeof parsed.amount === 'number' ? parsed.amount : null,
    concept: typeof parsed.concept === 'string' ? parsed.concept : null,
    category: typeof parsed.category === 'string' ? parsed.category : null,
    date: typeof parsed.date === 'string' ? parsed.date : null,
  }
}

async function handleScanReceipt(req, res) {
  const handlerStartedAt = Date.now()

  if (!OPENAI_API_KEY) {
    sendJson(res, 500, { error: 'OPENAI_API_KEY no está configurada en el backend.' })
    return
  }

  const body = await readJsonBody(req)
  const image = body?.image

  if (typeof image !== 'string' || !image.startsWith('data:image/')) {
    sendJson(res, 400, { error: 'Se esperaba { image: "data:image/...;base64,..." } en el body.' })
    return
  }

  console.info(`[scan-receipt] imagen recibida: ${Math.round((image.length * 3) / 4 / 1024)}KB`)
  const result = await callOpenAiVision(image)
  sendJson(res, 200, result)
  console.info(`[scan-receipt] handler total: ${Date.now() - handlerStartedAt}ms`)
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/scan-receipt') {
    // Si el body seguía subiendo cuando se rechazó (ej. superó MAX_BODY_BYTES),
    // recién cerramos esa conexión acá — DESPUÉS de que 'finish' confirma que la
    // respuesta ya se envió por completo. Cerrarla antes (como se hacía con un
    // req.destroy() inmediato) es lo que hacía que Vite nunca viera la respuesta
    // real y devolviera su propio 502 genérico en su lugar.
    res.on('finish', () => {
      if (!req.destroyed) req.destroy()
    })

    try {
      await handleScanReceipt(req, res)
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500
      console.error('[scan-receipt] error:', err)
      sendJson(res, status, { error: err.message || 'Error interno del servidor.' })
    }
    return
  }

  sendJson(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`[server] escuchando en http://localhost:${PORT} (POST /api/scan-receipt)`)
  if (!OPENAI_API_KEY) {
    console.warn('[server] ADVERTENCIA: OPENAI_API_KEY no está definida — el endpoint devolverá 500.')
  }
})
