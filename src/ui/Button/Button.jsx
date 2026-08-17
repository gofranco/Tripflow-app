import styles from './Button.module.css'

const VARIANTS = ['primary', 'secondary', 'ghost']

function Button({ variant = 'primary', disabled = false, className = '', children, ...rest }) {
  const variantClass = VARIANTS.includes(variant) ? styles[variant] : styles.primary

  return (
    <button
      type="button"
      className={`${styles.button} ${variantClass} ${className}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
