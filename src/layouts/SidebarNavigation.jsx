import { NavItem } from '../ui'
import styles from './SidebarNavigation.module.css'

// Datos estáticos — la navegación real vendrá de features/ en una etapa posterior.
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', active: true },
  { key: 'trips', label: 'Viajes', active: false },
  { key: 'expenses', label: 'Gastos', active: false },
]

function SidebarNavigation({ variant = 'fixed', onNavigate }) {
  return (
    <aside className={`${styles.sidebar} ${variant === 'drawer' ? styles.drawerVariant : ''}`.trim()}>
      <div className={styles.brand}>Tripflow</div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.key} label={item.label} active={item.active} onClick={onNavigate} />
        ))}
      </nav>

      <div className={styles.profile}>
        <div className={styles.avatar} aria-hidden="true">
          U
        </div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>Usuario Demo</span>
          <span className={styles.profileEmail}>demo@tripflow.app</span>
        </div>
      </div>
    </aside>
  )
}

export default SidebarNavigation
