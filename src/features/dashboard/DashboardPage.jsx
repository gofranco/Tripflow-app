import gastadoIllustration from '../../assets/dashboard/gastado-illustration.png'
import presupuestoIllustration from '../../assets/dashboard/presupuesto-illustration.png'
import { StatCard } from '../../ui'
import { formatCOP } from '../../utils/currency'
import DonutChartCard from '../expenses/components/DonutChartCard'
import RecentExpensesCard from '../expenses/components/RecentExpensesCard'
import { expenseCategories } from '../expenses/mock/categories'
import { recentExpenses } from '../expenses/mock/recentExpenses'
import TripBudgetBanner from '../trips/components/TripBudgetBanner'
import { activeTrip } from '../trips/mock/activeTrip'
import styles from './DashboardPage.module.css'

function DashboardPage() {
  return (
    <div className={styles.page}>
      <TripBudgetBanner
        tripName={activeTrip.name}
        budgetTotal={activeTrip.budgetTotal}
        spent={activeTrip.spent}
      />

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <div className={styles.metricsRow}>
            <StatCard
              visual={<img src={presupuestoIllustration} alt="" />}
              label="Presupuesto Total"
              value={formatCOP(activeTrip.budgetTotal)}
            />
            <StatCard
              visual={<img src={gastadoIllustration} alt="" />}
              label="Gastado"
              value={formatCOP(activeTrip.spent)}
              valueClassName={styles.gastadoValue}
            />
          </div>

          <DonutChartCard categories={expenseCategories} />
        </div>

        <RecentExpensesCard expenses={recentExpenses} />
      </div>
    </div>
  )
}

export default DashboardPage
