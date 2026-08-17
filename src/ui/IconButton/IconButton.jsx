import styles from './IconButton.module.css'

const SIZES = ['medium', 'small']

function IconButton({ icon, label, size = 'medium', disabled = false, className = '', ...rest }) {
  const sizeClass = SIZES.includes(size) ? styles[size] : styles.medium

  return (
    <button
      type="button"
      className={`${styles.button} ${sizeClass} ${className}`.trim()}
      disabled={disabled}
      aria-label={label}
      title={label}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}

export default IconButton
