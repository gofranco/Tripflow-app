import styles from './Button.module.css'

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger']

function Button({ variant = 'primary', icon, disabled = false, className = '', children, ...rest }) {
  const variantClass = VARIANTS.includes(variant) ? styles[variant] : styles.primary

  return (
    <button
      type="button"
      className={`${styles.button} ${variantClass} ${className}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}

export default Button
