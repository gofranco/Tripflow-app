// Llama al backend mínimo (server/index.js, POST /api/scan-receipt) — la API key
// de OpenAI vive solo ahí, nunca en este archivo ni en ningún código de cliente.
//
// Presupuesto total del scanner: 10s HARD LIMIT (ver ReceiptScanner.jsx). Este
// timeout es el que lo hace cumplir del lado del cliente — el backend además
// tiene su propio timeout más corto hacia OpenAI (~7.5s, ver server/index.js)
// para que, en el caso normal, el backend ya haya abortado y respondido con un
// error ANTES de que este timeout dispare.
const REQUEST_TIMEOUT_MS = 10_000

export async function scanReceipt(imageDataUrl) {
  const controller = new AbortController()
  const startedAt = performance.now()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response
  try {
    response = await fetch('/api/scan-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageDataUrl }),
      signal: controller.signal,
    })
  } catch (err) {
    // AbortError = disparó nuestro propio timeout (o el usuario/navegador
    // canceló) — nunca queremos que ReceiptScanner se quede esperando esta
    // promesa para siempre; la convertimos en un Error normal (con .isTimeout
    // para que sea distinguible de otros fallos) manejable por el catch
    // existente en ReceiptScanner (estado "error" con Reintentar).
    if (err.name === 'AbortError') {
      const timeoutError = new Error('La operación tardó demasiado (más de 10s). Intenta de nuevo.', { cause: err })
      timeoutError.isTimeout = true
      throw timeoutError
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
    console.info(`[scanReceipt] request: ${Math.round(performance.now() - startedAt)}ms`)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || 'No pudimos procesar el recibo. Intenta de nuevo.')
  }

  return data
}
