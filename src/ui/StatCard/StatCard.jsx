import styles from './StatCard.module.css'

function StatCard({ visual, label, value, className = '' }) {
  return (
    <div className={`${styles.card} ${className}`.trim()}>
      {visual && (
        <div className={styles.visual} aria-hidden="true">
          {visual}
        </div>
      )}
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  )
}

export default StatCard
