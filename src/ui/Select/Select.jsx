import { useId } from 'react'
import styles from './Select.module.css'

function Select({ label, id, error, disabled = false, className = '', children, ...rest }) {
  const generatedId = useId()
  const selectId = id || generatedId
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${styles.select} ${error ? styles.error : ''}`.trim()}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
