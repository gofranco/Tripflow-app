import { useEffect, useRef, useState } from 'react'
import { formatCOP } from '../../../utils/currency'
import { resolveBudgetAlertState } from './budgetAlertStates'
import styles from './BudgetAlertPopup.module.css'

// Debe coincidir con la duración de salida (transition-duration) de .overlayClosing/
// .cardClosing en BudgetAlertPopup.module.css.
const EXIT_ANIMATION_MS = 160

function BudgetAlertPopup({ open, onClose, percentUsed, spent, budgetTotal }) {
  const state = resolveBudgetAlertState(percentUsed)
  const isOpen = open && Boolean(state)

  // phase controla tanto el montaje (mientras es "closed" el popup no se renderiza)
  // como la clase visual: "mounting" es el frame inicial recién montado (para que el
  // navegador sí anime desde el estado de entrada), "open" es el estado visible
  // estable, "closing" reproduce la animación de salida antes de desmontar de verdad.
  const [phase, setPhase] = useState('closed')
  const closeTimeoutRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      clearTimeout(closeTimeoutRef.current)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- debe montar de inmediato al abrir; sin esto habría un frame sin popup antes de poder animar la entrada (mismo patrón ya usado en ui/Drawer).
      setPhase('mounting')
      const raf = requestAnimationFrame(() => setPhase('open'))
      return () => cancelAnimationFrame(raf)
    }

    setPhase((prev) => (prev === 'closed' ? 'closed' : 'closing'))
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    closeTimeoutRef.current = setTimeout(
      () => setPhase('closed'),
      prefersReducedMotion ? 0 : EXIT_ANIMATION_MS,
    )
    return () => clearTimeout(closeTimeoutRef.current)
  }, [isOpen])

  useEffect(() => {
    if (phase === 'closed') return
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [phase, onClose])

  if (phase === 'closed') return null

  const fillWidth = `${Math.min(Math.max(percentUsed, 0), 100)}%`
  const overlayClassName = `${styles.overlay} ${phase === 'open' ? styles.overlayVisible : ''} ${phase === 'closing' ? styles.overlayClosing : ''}`.trim()
  const cardClassName = `${styles.card} ${phase === 'open' ? styles.cardVisible : ''} ${phase === 'closing' ? styles.cardClosing : ''}`.trim()

  return (
    <div className={overlayClassName} onClick={onClose}>
      <div
        className={cardClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-alert-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.iconBadge} style={{ background: state.iconBg }}>
            <img src={state.icon} alt="" aria-hidden="true" />
          </span>
          <span className={styles.severityBadge} style={{ background: state.badgeBg, color: state.accentColor }}>
            {state.label}
          </span>
        </div>

        <div className={styles.textBlock}>
          <h2 id="budget-alert-title" className={styles.title}>
            {state.title}
          </h2>
          <p className={styles.message}>{state.message}</p>
        </div>

        <div className={styles.progressStats}>
          <div className={styles.labelsRow}>
            <span className={styles.usedLabel}>{state.usedLabel}</span>
            <span className={styles.percentValue} style={{ color: state.accentColor }}>
              {Math.round(percentUsed)}%
            </span>
          </div>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: fillWidth, background: state.accentColor }} />
          </div>
          <div className={styles.valuesRow}>
            <p className={styles.spentValue}>
              Gastado: <strong>{formatCOP(spent)}</strong>
            </p>
            <p className={styles.totalValue}>Total: {formatCOP(budgetTotal)}</p>
          </div>
        </div>

        <button
          type="button"
          className={styles.cta}
          style={{ background: state.accentColor }}
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

export default BudgetAlertPopup
