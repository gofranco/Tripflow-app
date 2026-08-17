import bedIcon from '../../../assets/dashboard/icon-bed.svg'
import carIcon from '../../../assets/dashboard/icon-car.svg'
import landmarkIcon from '../../../assets/dashboard/icon-landmark.svg'
import shoppingBagIcon from '../../../assets/dashboard/icon-shopping-bag.svg'
import utensilsIcon from '../../../assets/dashboard/icon-utensils.svg'
import { Badge } from '../../../ui'
import { formatExpenseAmount } from '../../../utils/currency'
import styles from './ExpenseRow.module.css'

// Íconos y colores reales por categoría, tomados de "Gastos Recientes Card" en Figma.
const CATEGORY_META = {
  Transporte: { icon: carIcon, color: 'var(--color-category-transport)' },
  Alimentación: { icon: utensilsIcon, color: 'var(--color-category-food)' },
  Compras: { icon: shoppingBagIcon, color: 'var(--color-category-shopping)' },
  Alojamiento: { icon: bedIcon, color: 'var(--color-category-accommodation)' },
  Actividades: { icon: landmarkIcon, color: 'var(--color-category-activities)' },
  Otros: { icon: shoppingBagIcon, color: 'var(--color-category-other)' },
}

function ExpenseRow({ description, category, date, amount }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.Otros

  return (
    <li className={styles.row}>
      <span
        className={styles.icon}
        style={{ background: `color-mix(in srgb, ${meta.color} 15%, transparent)` }}
        aria-hidden="true"
      >
        <img src={meta.icon} alt="" />
      </span>
      <div className={styles.details}>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span>{date}</span>
          <span aria-hidden="true">·</span>
          <Badge color={meta.color}>{category}</Badge>
        </div>
      </div>
      <span className={styles.amount}>{formatExpenseAmount(amount)}</span>
    </li>
  )
}

export default ExpenseRow
