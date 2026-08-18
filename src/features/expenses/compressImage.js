// Reduce el lado máximo a ~1600px y re-encodea a JPEG calidad 0.8 antes de subir
// — una foto de celular sin comprimir puede pesar varios MB, cerca o por encima
// del límite del backend (ver server/index.js MAX_BODY_BYTES) y lenta de subir
// sobre Wi-Fi. 1600px de lado mayor sigue siendo más que suficiente resolución
// para que la visión de OpenAI lea texto de un recibo. Sin dependencias nuevas:
// solo Canvas API nativa del navegador.
const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.8

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No pudimos leer la imagen capturada.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No pudimos leer la imagen capturada.'))
    img.src = src
  })
}

// Devuelve { dataUrl, originalBytes, compressedBytes, width, height, compressMs } —
// los tamaños/tiempos son solo informativos (logging temporal para medir el
// presupuesto de 10s del scanner, ver ReceiptScanner.jsx), no afectan el
// comportamiento.
export async function compressImage(file) {
  const startedAt = performance.now()

  const originalDataUrl = await readAsDataURL(file)
  const img = await loadImage(originalDataUrl)

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  // toDataURL no incluye EXIF/metadata del original (orientación, GPS, etc.) —
  // el re-encode vía canvas ya la descarta, sin ningún paso extra.
  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)

  return {
    dataUrl,
    originalBytes: file.size,
    compressedBytes: Math.round((dataUrl.length * 3) / 4), // aprox. bytes reales desde base64
    width,
    height,
    compressMs: Math.round(performance.now() - startedAt),
  }
}
