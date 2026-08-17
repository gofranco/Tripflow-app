import styles from './Badge.module.css'

const VARIANTS = ['success', 'warning', 'danger', 'neutral']

function Badge({ variant = 'neutral', children, className = '' }) {
  const variantClass = VARIANTS.includes(variant) ? styles[variant] : styles.neutral

  return <span className={`${styles.badge} ${variantClass} ${className}`.trim()}>{children}</span>
}

export default Badge
