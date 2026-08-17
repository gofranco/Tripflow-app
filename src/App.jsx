import { AppShell } from './layouts'
import styles from './App.module.css'

function App() {
  return (
    <AppShell>
      <div className={styles.placeholder}>
        <h1 className={styles.placeholderTitle}>Dashboard</h1>
        <p className={styles.placeholderText}>
          El contenido del dashboard se implementará en una etapa posterior.
        </p>
      </div>
    </AppShell>
  )
}

export default App
