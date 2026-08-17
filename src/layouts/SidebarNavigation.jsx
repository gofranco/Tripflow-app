import dashboardIcon from '../assets/dashboard/icon-dashboard.svg'
import logo from '../assets/dashboard/logo.png'
import { NavItem } from '../ui'
import styles from './SidebarNavigation.module.css'

// Datos estáticos — la navegación real vendrá de features/ en una etapa posterior.
const NAV_ITEMS = [{ key: 'dashboard', label: 'Dashboard', icon: dashboardIcon, active: true }]

// Usuario demo — replica el placeholder "Amy Diaz" usado en el Dashboard final de Figma.
const currentUser = { initials: 'AD', name: 'Amy Diaz', email: 'amydi26@gmail.com' }

function SidebarNavigation({ variant = 'fixed', onNavigate }) {
  return (
    <aside className={`${styles.sidebar} ${variant === 'drawer' ? styles.drawerVariant : ''}`.trim()}>
      <div className={styles.logoRow}>
        <img src={logo} alt="Tripflow" className={styles.logo} />
      </div>

      <nav className={styles.nav}>
        <p className={styles.sectionLabel}>GENERAL</p>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.key}
            label={item.label}
            active={item.active}
            icon={<img src={item.icon} alt="" />}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className={styles.profileWrapper}>
        <div className={styles.profileCard}>
          <div className={styles.avatar} aria-hidden="true">
            {currentUser.initials}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{currentUser.name}</span>
            <span className={styles.profileEmail}>{currentUser.email}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarNavigation
