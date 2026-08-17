import styles from './Badge.module.css'

const VARIANTS = ['success', 'warning', 'danger', 'neutral']

// `color` permite tags con un color arbitrario (ej. categorías de gasto), replicando
// el patrón real de Figma: texto en el color sólido, fondo en el mismo color al ~10%.
function Badge({ variant = 'neutral', color, children, className = '' }) {
  const variantClass = !color && VARIANTS.includes(variant) ? styles[variant] : ''
  const style = color
    ? { color, background: `color-mix(in srgb, ${color} 12%, transparent)` }
    : undefined

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`.trim()} style={style}>
      {children}
    </span>
  )
}

export default Badge
