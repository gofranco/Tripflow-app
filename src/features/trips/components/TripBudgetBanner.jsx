import { Badge } from '../../../ui'
import { formatCOP } from '../../../utils/currency'
import styles from './TripBudgetBanner.module.css'

// Los 7 estados y sus umbrales replican 1:1 los definidos en Figma
// (06 - Design System → Trip Budget Banner).
const BUDGET_BANDS = [
  { max: 40, label: 'Todo bajo control', tone: 'success' },
  { max: 60, label: 'Vas muy bien', tone: 'success' },
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
  const percentUsed = budgetTotal > 0 ? (spent / budgetTotal) * 100 : 0
  const band = resolveBand(percentUsed)
  const remaining = budgetTotal - spent
  const isOverBudget = remaining < 0

  return (
    <section className={`${styles.banner} ${styles[band.tone]}`}>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <div>
            <p className={styles.eyebrow}>Viaje Activo</p>
            <h2 className={styles.tripName}>{tripName}</h2>
          </div>
          <Badge variant={band.tone}>{band.label}</Badge>
        </div>

        <div className={styles.progressRow}>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${Math.min(percentUsed, 100)}%` }} />
          </div>
          <span className={styles.percent}>{percentUsed.toFixed(1).replace('.', ',')}%</span>
        </div>

        <p className={styles.remaining}>
          {isOverBudget ? 'Presupuesto excedido: ' : 'Presupuesto restante: '}
          <strong>{formatCOP(Math.abs(remaining))}</strong>
        </p>
      </div>
    </section>
  )
}

export default TripBudgetBanner
