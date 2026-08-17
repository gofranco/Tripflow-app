import { formatCompactCOP } from '../../../utils/currency'
import styles from './DonutChartCard.module.css'

// Reparte el remanente por resto-mayor para que los porcentajes mostrados sumen
// exactamente 100 (igual que el legend en Figma), en vez de redondear cada uno
// de forma independiente.
function roundPercentagesToTotal(values, total) {
  const raw = values.map((value) => (total > 0 ? (value / total) * 100 : 0))
  const floors = raw.map(Math.floor)
  const remainder = 100 - floors.reduce((sum, value) => sum + value, 0)

  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)

  const result = [...floors]
  for (let i = 0; i < remainder; i += 1) {
    result[order[i].index] += 1
  }
  return result
}

function DonutChartCard({ categories, totalLabel = 'Gastado' }) {
  const total = categories.reduce((sum, category) => sum + category.amount, 0)
  const displayPercents = roundPercentagesToTotal(
    categories.map((category) => category.amount),
    total,
  )

  const slices = categories.reduce((acc, category, index) => {
    const rawPercent = total > 0 ? (category.amount / total) * 100 : 0
    const start = acc.length > 0 ? acc[acc.length - 1].end : 0
    const end = start + rawPercent
    acc.push({ ...category, start, end, displayPercent: displayPercents[index] })
    return acc
  }, [])

  const gradient = slices.map((slice) => `${slice.color} ${slice.start}% ${slice.end}%`).join(', ')

  return (
    <section className={styles.card}>
      <header>
        <h3 className={styles.title}>Distribución de tus gastos</h3>
        <p className={styles.subtitle}>Por categoría · Donut Chart</p>
      </header>

      <div className={styles.body}>
        <div className={styles.donut} style={{ background: `conic-gradient(${gradient})` }}>
          <div className={styles.center}>
            <span className={styles.centerValue}>{formatCompactCOP(total)}</span>
            <span className={styles.centerLabel}>{totalLabel}</span>
          </div>
        </div>

        <ul className={styles.legend}>
          {slices.map((slice) => (
            <li key={slice.key} className={styles.legendRow}>
              <span className={styles.legendLeft}>
                <span className={styles.dot} style={{ background: slice.color }} aria-hidden="true" />
                {slice.label}
              </span>
              <span className={styles.legendRight}>
                <span>{formatCompactCOP(slice.amount)}</span>
                <span className={styles.legendPercent} style={{ color: slice.color }}>
                  {slice.displayPercent}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default DonutChartCard
