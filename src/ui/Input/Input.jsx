import { useId } from 'react'
import styles from './Input.module.css'

function Input({ label, id, error, disabled = false, className = '', ...rest }) {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.error : ''}`.trim()}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
