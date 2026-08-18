import { useEffect, useId } from 'react'
import styles from './Drawer.module.css'

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

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.panel} ${styles[side] || styles.right} ${panelClassName}`.trim()}
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
