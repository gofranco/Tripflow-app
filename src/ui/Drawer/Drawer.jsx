import { useEffect, useId } from 'react'
import styles from './Drawer.module.css'

function Drawer({ open, onClose, title, children, side = 'right' }) {
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
        className={`${styles.panel} ${styles[side] || styles.right}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
              ×
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

export default Drawer
