import { useEffect, useRef } from 'react'
import { Button } from '../../../ui'
import styles from './DeleteTripDialog.module.css'

// Confirmación de eliminar viaje — modal liviano (sin fases de entrada/salida
// animadas, no fue pedido para esta etapa), consistente con el Design System
// claro existente (mismos tokens que BudgetAlertPopup: surface/border/radius/
// shadow), no con la paleta oscura del AI Receipt Scanner.
//
// No usa portal a document.body: a diferencia de ReceiptScanner (montado dentro
// del Drawer, cuyo .panel tiene `transform`), este diálogo se monta directo en
// DashboardHeader, sin ningún ancestro con transform — un position:fixed normal
// ya cubre toda la pantalla sin el bug de containing-block que resolvimos antes.
function DeleteTripDialog({ open, trip, onCancel, onConfirm }) {
  // Ref (no state): bloquea un doble click de forma síncrona, sin esperar a que
  // React vuelva a renderizar para deshabilitar el botón.
  const hasConfirmedRef = useRef(false)

  useEffect(() => {
    if (!open) return
    hasConfirmedRef.current = false
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open || !trip) return null

  function handleConfirm() {
    if (hasConfirmedRef.current) return
    hasConfirmedRef.current = true
    onConfirm(trip.id)
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.card}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-trip-title"
        aria-describedby="delete-trip-description"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-trip-title" className={styles.title}>
          ¿Eliminar {trip.name}?
        </h2>
        <p id="delete-trip-description" className={styles.message}>
          Se eliminarán el viaje <strong>{trip.name}</strong> y todos sus gastos asociados. Esta acción es
          permanente y no se puede deshacer.
        </p>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel} className={styles.actionButton}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm} className={styles.actionButton}>
            Eliminar viaje
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTripDialog
