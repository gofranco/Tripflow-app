import { useEffect, useId, useRef, useState } from 'react'
import styles from './Drawer.module.css'

// Debe coincidir con la duración de transición de .overlay/.panel en Drawer.module.css.
const CLOSE_ANIMATION_MS = 220

function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'right',
  panelClassName = '',
  titleClassName = '',
  contentClassName = '',
  closeLabel = '×',
  closeButtonClassName = '',
}) {
  const titleId = useId()
  // shouldRender mantiene el Drawer montado durante la animación de salida;
  // isVisible controla las clases "entrado" (se activa un frame después de montar,
  // para que el navegador sí anime la transición desde el estado cerrado).
  const [shouldRender, setShouldRender] = useState(open)
  const [isVisible, setIsVisible] = useState(false)
  const closeTimeoutRef = useRef(null)

  // Toda la sincronización de shouldRender/isVisible con la prop `open` vive acá,
  // en un único efecto — antes parte de esta lógica se ajustaba durante el render
  // (comparando `open` contra un `prevOpen` guardado en estado), pero ese patrón
  // competía con el setIsVisible(true) del requestAnimationFrame de más abajo: un
  // re-render disparado por el rAF podía volver a ejecutar el ajuste-durante-render
  // y dejar shouldRender en false aunque `open` siguiera en true, así que el Drawer
  // nunca llegaba a pintarse (bug intermitente reproducido con Playwright).
  useEffect(() => {
    if (open) {
      clearTimeout(closeTimeoutRef.current)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- debe montar de inmediato al abrir; sin esto habría un frame sin Drawer antes de poder animar la entrada.
      setShouldRender(true)
      const raf = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(raf)
    }

    setIsVisible(false)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    closeTimeoutRef.current = setTimeout(
      () => setShouldRender(false),
      prefersReducedMotion ? 0 : CLOSE_ANIMATION_MS,
    )
    return () => clearTimeout(closeTimeoutRef.current)
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Bloquea el scroll del documento de fondo mientras el Drawer está visible o
  // animándose hacia afuera — sin esto, un gesto de scroll dentro del panel (ej.
  // el calendario en mobile) puede filtrarse al body y dejar la página detrás
  // desplazada al cerrar. Se mantiene bloqueado hasta que termina de desmontarse,
  // no solo mientras `open` es true, para no destrabar el scroll a mitad de la
  // animación de salida.
  useEffect(() => {
    if (!shouldRender) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ''}`.trim()}
      onClick={onClose}
    >
      <div
        className={`${styles.panel} ${styles[side] || styles.right} ${isVisible ? styles.panelVisible : ''} ${panelClassName}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <h2 id={titleId} className={`${styles.title} ${titleClassName}`.trim()}>
              {title}
            </h2>
            <button
              type="button"
              className={`${styles.closeButton} ${closeButtonClassName}`.trim()}
              onClick={onClose}
              aria-label={closeLabel === '×' ? 'Cerrar' : undefined}
            >
              {closeLabel}
            </button>
          </div>
        )}
        <div className={`${styles.content} ${contentClassName}`.trim()}>{children}</div>
      </div>
    </div>
  )
}

export default Drawer
