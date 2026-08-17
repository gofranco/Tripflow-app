import styles from './StatCard.module.css'

function StatCard({ visual, label, value, valueClassName = '', className = '' }) {
  return (
    <div className={`${styles.card} ${className}`.trim()}>
      {visual && (
        <div className={styles.visual} aria-hidden="true">
          {visual}
        </div>
      )}
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={`${styles.value} ${valueClassName}`.trim()}>{value}</span>
      </div>
    </div>
  )
}

export default StatCard
