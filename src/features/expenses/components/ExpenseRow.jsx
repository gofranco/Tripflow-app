import { Badge } from '../../../ui'
import { formatExpenseAmount } from '../../../utils/currency'
import styles from './ExpenseRow.module.css'

// Glifos de texto como placeholder de los iconos por categoría (car/utensils/
// shopping-bag/bed/landmark en Figma) — pendientes de los assets reales.
const CATEGORY_ICONS = {
  Transporte: '🚗',
  Alimentación: '🍽️',
  Compras: '🛍️',
  Alojamiento: '🛏️',
  Actividades: '🏛️',
  Otros: '📦',
}

function ExpenseRow({ description, category, date, amount }) {
  return (
    <li className={styles.row}>
      <span className={styles.icon} aria-hidden="true">
        {CATEGORY_ICONS[category] ?? '📦'}
      </span>
      <div className={styles.details}>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span>{date}</span>
          <span aria-hidden="true">·</span>
          <Badge variant="neutral">{category}</Badge>
        </div>
      </div>
      <span className={styles.amount}>{formatExpenseAmount(amount)}</span>
    </li>
  )
}

export default ExpenseRow
