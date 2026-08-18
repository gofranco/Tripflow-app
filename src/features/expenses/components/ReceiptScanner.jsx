import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import aiIconA from '../../../assets/scan/ai-icon-group-a.svg'
import aiIconB from '../../../assets/scan/ai-icon-group-b.svg'
import { compressImage } from '../compressImage'
import { scanReceipt } from '../scanReceipt'
import styles from './ReceiptScanner.module.css'

// Flujo AI Receipt Scanner — captura → procesa de inmediato, sin pantalla de
// confirmación intermedia (a pedido explícito: "debería procesarla de una vez").
// La pantalla de "Procesando Factura" es 1:1 con Figma (nodo 137:1728). Ya no se
// implementa la pantalla "Confirmar Captura" (137:1699, tenía un botón manual
// "Escanear con AI") ni "scan-camera" (137:1668, cámara custom) — la captura usa
// <input type="file" capture="environment">, la cámara nativa del sistema
// operativo, y apenas hay una foto se dispara el escaneo solo.
//
// La imagen capturada vive SOLO en memoria (estado de este componente) mientras
// dura el flujo — nunca se escribe a localStorage/sessionStorage, y se descarta al
// cerrar el scanner (aceptado o cancelado).
//
// Portal a document.body: este componente se monta dentro del AddExpenseDrawer, y
// el .panel del Drawer tiene `transform` para su propia animación de entrada/salida
// — eso lo convierte en "containing block" de cualquier position:fixed anidado
// (mismo bug que ya resolvimos con BudgetAlertPopup/.page), rompiendo el overlay
// full-screen. El portal lo saca de ese árbol por completo.
function ReceiptScanner({ onExtracted, onClose }) {
  const [phase, setPhase] = useState('capturing') // capturing | processing | error
  const [imageDataUrl, setImageDataUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)
  const hasOpenedCameraRef = useRef(false)

  // Abre la cámara nativa apenas se monta el componente (el usuario ya tocó
  // "Escanear recibo" en el formulario) — sin esto habría un paso intermedio
  // innecesario antes de que aparezca la cámara.
  useEffect(() => {
    if (hasOpenedCameraRef.current) return
    hasOpenedCameraRef.current = true
    fileInputRef.current?.click()
  }, [])

  useEffect(() => {
    if (phase !== 'processing' || !imageDataUrl) return
    let cancelled = false
    // Presupuesto de performance: "Escanear con AI" -> datos en el formulario
    // debe ser ≤10s (HARD LIMIT, forzado por el timeout de scanReceipt.js).
    // Este log mide el tiempo real end-to-end tal como lo vive el usuario.
    const startedAt = performance.now()

    scanReceipt(imageDataUrl)
      .then((data) => {
        if (cancelled) return
        console.info(`[ReceiptScanner] tiempo total (click -> datos): ${Math.round(performance.now() - startedAt)}ms`)
        onExtracted(data)
      })
      .catch((err) => {
        if (cancelled) return
        console.info(`[ReceiptScanner] tiempo total (click -> error): ${Math.round(performance.now() - startedAt)}ms`)
        setErrorMessage(err.message || 'No pudimos procesar el recibo.')
        setPhase('error')
      })

    return () => {
      cancelled = true
    }
  }, [phase, imageDataUrl, onExtracted])

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // permite volver a elegir el mismo archivo en un "retake"
    if (!file) {
      // El usuario canceló la cámara — vuelve directo al formulario manual.
      onClose()
      return
    }
    // Comprime y arranca el procesamiento de inmediato — sin pantalla de
    // confirmación intermedia ni botón manual: apenas hay una foto, se escanea.
    compressImage(file)
      .then(({ dataUrl, originalBytes, compressedBytes, width, height, compressMs }) => {
        console.info(
          `[ReceiptScanner] imagen comprimida: ${(originalBytes / 1024).toFixed(0)}KB → ${(compressedBytes / 1024).toFixed(0)}KB ` +
            `(${width}x${height}, ${compressMs}ms)`,
        )
        setImageDataUrl(dataUrl)
        setPhase('processing')
      })
      .catch((err) => {
        setErrorMessage(err.message || 'No pudimos leer la imagen capturada.')
        setPhase('error')
      })
  }

  function handleRetake() {
    setImageDataUrl(null)
    fileInputRef.current?.click()
  }

  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      capture="environment"
      className={styles.hiddenInput}
      onChange={handleFileChange}
    />
  )

  let content

  if (phase === 'capturing') {
    // Sin UI propia: el navegador ya está mostrando la cámara nativa del sistema.
    content = <div className={styles.overlay}>{hiddenInput}</div>
  } else if (phase === 'processing') {
    content = (
      <div className={styles.overlay}>
        <div className={styles.screen}>
          <div className={styles.processingMain}>
            <div className={styles.aiIcon}>
              <img src={aiIconA} alt="" aria-hidden="true" className={styles.aiIconA} />
              <img src={aiIconB} alt="" aria-hidden="true" className={styles.aiIconB} />
            </div>
            <div className={styles.feedbackInfo}>
              <p className={styles.processingTitle}>Procesando Factura</p>
              <p className={styles.processingSubtitle}>Extrayendo datos de factura con Trip Agent...</p>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} />
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    // error — no está diseñado en Figma; construido con la misma paleta oscura del
    // resto del flujo, con las dos salidas que pide el requerimiento: reintentar o
    // seguir a mano.
    content = (
      <div className={styles.overlay}>
        {hiddenInput}
        <div className={styles.screen}>
          <div className={styles.processingMain}>
            <div className={styles.errorBadge} aria-hidden="true">
              !
            </div>
            <div className={styles.feedbackInfo}>
              <p className={styles.processingTitle}>No pudimos escanear la factura</p>
              <p className={styles.processingSubtitle}>{errorMessage}</p>
            </div>
            <div className={styles.errorActions}>
              <button type="button" className={styles.primaryAction} onClick={handleRetake}>
                Reintentar
              </button>
              <button type="button" className={styles.secondaryAction} onClick={onClose}>
                Continuar manualmente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return createPortal(content, document.body)
}

export default ReceiptScanner
