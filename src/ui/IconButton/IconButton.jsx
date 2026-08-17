import styles from './IconButton.module.css'

const SIZES = ['large', 'medium', 'small']
const VARIANTS = ['ghost', 'outline']

function IconButton({
  icon,
  label,
  size = 'medium',
  variant = 'ghost',
  disabled = false,
  className = '',
  ...rest
}) {
  const sizeClass = SIZES.includes(size) ? styles[size] : styles.medium
  const variantClass = VARIANTS.includes(variant) ? styles[variant] : styles.ghost

  return (
    <button
      type="button"
      className={`${styles.button} ${sizeClass} ${variantClass} ${className}`.trim()}
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
