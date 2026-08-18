import gastadoIllustration from '../../assets/dashboard/gastado-illustration.png'
import presupuestoIllustration from '../../assets/dashboard/presupuesto-illustration.png'
import { StatCard } from '../../ui'
import { formatCOP } from '../../utils/currency'
import DonutChartCard from '../expenses/components/DonutChartCard'
import RecentExpensesCard from '../expenses/components/RecentExpensesCard'
import TripBudgetBanner from '../trips/components/TripBudgetBanner'
import { useActiveTripSummary } from './useActiveTripSummary'
import styles from './DashboardPage.module.css'

function DashboardPage({ activeTrip, expenses }) {
  const { spent, categories, recentExpenses } = useActiveTripSummary(activeTrip, expenses)

  return (
    // key={activeTrip.id}: al cambiar de viaje activo, React monta un nodo nuevo
    // en vez de actualizar el existente — eso dispara el fade-in sutil de .page
    // (ver DashboardPage.module.css) como feedback de "los datos cambiaron", sin
    // tocar el estado de trips/expenses ni recargar nada de verdad.
    <div key={activeTrip.id} className={styles.page}>
      <TripBudgetBanner tripName={activeTrip.name} budgetTotal={activeTrip.budgetTotal} spent={spent} />

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
              value={formatCOP(spent)}
              valueClassName={styles.gastadoValue}
            />
          </div>

          <DonutChartCard categories={categories} />
        </div>

        <RecentExpensesCard expenses={recentExpenses} />
      </div>
    </div>
  )
}

export default DashboardPage
