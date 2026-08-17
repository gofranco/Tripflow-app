import styles from './NavItem.module.css'

function NavItem({ icon, label, active = false, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`${styles.navItem} ${active ? styles.active : ''} ${className}`.trim()}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </button>
  )
}

export default NavItem
