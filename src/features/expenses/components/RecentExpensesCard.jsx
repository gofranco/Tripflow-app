import ExpenseRow from './ExpenseRow'
import styles from './RecentExpensesCard.module.css'

function RecentExpensesCard({ expenses }) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Gastos recientes</h3>
      <ul className={styles.list}>
        {expenses.map((expense) => (
          <ExpenseRow key={expense.id} {...expense} />
        ))}
      </ul>
    </section>
  )
}

export default RecentExpensesCard
