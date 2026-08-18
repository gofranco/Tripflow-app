import { formatCOP } from '../../../utils/currency'
import styles from './TripBudgetBanner.module.css'

// Los 7 estados y sus umbrales replican 1:1 los definidos en Figma (Design System →
// Trip Budget Banner). El label de la banda 41-60% ("Vas bien!") viene de la instancia
// real usada en el Dashboard final, que difiere del texto de la hoja de referencia
// de estados ("Vas muy bien").
const BUDGET_BANDS = [
  { max: 40, label: 'Todo bajo control', tone: 'success' },
  { max: 60, label: 'Vas bien!', tone: 'success' },
  { max: 75, label: 'Baja un cambio', tone: 'warning' },
  { max: 90, label: 'Ojo con el ritmo', tone: 'warning' },
  { max: 100, label: 'Últimos pesos', tone: 'warning' },
  { max: 120, label: 'Te pasaste', tone: 'danger' },
  { max: Infinity, label: 'Se nos fue la mano', tone: 'danger' },
]

function resolveBand(percentUsed) {
  return BUDGET_BANDS.find((band) => percentUsed <= band.max) ?? BUDGET_BANDS[BUDGET_BANDS.length - 1]
}

function TripBudgetBanner({ tripName, budgetTotal, spent }) {
  // budgetTotal/spent inválidos (corrupción de datos, viaje sin presupuesto
  // numérico) nunca deben producir NaN/Infinity visibles en el banner.
  const safeBudgetTotal = Number.isFinite(budgetTotal) ? budgetTotal : 0
  const safeSpent = Number.isFinite(spent) ? spent : 0

  const percentUsed = safeBudgetTotal > 0 ? (safeSpent / safeBudgetTotal) * 100 : 0
  const band = resolveBand(percentUsed)
  const remaining = safeBudgetTotal - safeSpent
  const isOverBudget = remaining < 0

  return (
    <section className={`${styles.banner} ${styles[band.tone]}`}>
      <div className={styles.accent} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.titleGroup}>
            <p className={styles.eyebrow}>Viaje Activo</p>
            <h2 className={styles.tripName}>{tripName}</h2>
          </div>
          <span className={styles.statusBadge}>{band.label}</span>
        </div>

        <div className={styles.progressRow}>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${Math.min(percentUsed, 100)}%` }} />
          </div>
          <span className={styles.percent}>{percentUsed.toFixed(1).replace('.', ',')}%</span>
        </div>

        <p className={styles.remaining}>
          {isOverBudget ? 'Presupuesto excedido: ' : 'Presupuesto restante: '}
          <span className={styles.remainingAmount}>{formatCOP(Math.abs(remaining))}</span>
        </p>
      </div>
    </section>
  )
}

export default TripBudgetBanner
