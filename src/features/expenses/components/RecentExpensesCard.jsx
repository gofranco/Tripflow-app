import ExpenseRow from './ExpenseRow'
import styles from './RecentExpensesCard.module.css'

function RecentExpensesCard({ expenses, currency }) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Gastos recientes</h3>

      {expenses.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Aún no hay gastos registrados</p>
          <p className={styles.emptyText}>Los gastos que registres para este viaje aparecerán aquí.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {expenses.map((expense) => (
            <ExpenseRow key={expense.id} {...expense} currency={currency} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default RecentExpensesCard
