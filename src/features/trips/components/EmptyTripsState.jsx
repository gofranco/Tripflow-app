import styles from './EmptyTripsState.module.css'

// Se muestra cuando trips queda vacío (ej. después de eliminar el último viaje)
// — el CTA para crear un viaje ya vive en DashboardHeader ("Nuevo viaje", siempre
// visible/habilitado incluso sin viajes), así que este componente solo comunica
// el estado; no duplica el Drawer de creación.
function EmptyTripsState() {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>Aún no tenés viajes</p>
      <p className={styles.emptyText}>Creá tu primer viaje con el botón "Nuevo viaje" para empezar a registrar gastos.</p>
    </div>
  )
}

export default EmptyTripsState
