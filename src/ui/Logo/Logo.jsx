import logoMark from '../../assets/dashboard/logo-mark.svg'
import styles from './Logo.module.css'

// Lockup del nuevo brand (Brand Refresh): ícono vectorial real exportado de Figma
// (nodo 147:1794, gradientes violeta→azul→cian exactos) + wordmark "tripflow" como
// texto real (fuente Catamaran, cargada solo para este componente — no se toca la
// tipografía global del proyecto). El texto real también sirve de nombre accesible,
// así que el ícono queda decorativo (alt vacío) en vez de duplicar "Tripflow" dos veces.
function Logo({ className = '', iconClassName = '', wordmarkClassName = '' }) {
  return (
    <span className={`${styles.logo} ${className}`.trim()}>
      <img src={logoMark} alt="" className={`${styles.icon} ${iconClassName}`.trim()} aria-hidden="true" />
      <span className={`${styles.wordmark} ${wordmarkClassName}`.trim()}>tripflow</span>
    </span>
  )
}

export default Logo
