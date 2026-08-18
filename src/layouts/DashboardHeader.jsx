import { useEffect, useState } from 'react'
import addDarkIcon from '../assets/dashboard/icon-add-dark.svg'
import addWhiteIcon from '../assets/dashboard/icon-add-white.svg'
import deleteIcon from '../assets/dashboard/icon-delete.svg'
import AddExpenseDrawer from '../features/expenses/components/AddExpenseDrawer'
import CreateTripDrawer from '../features/trips/components/CreateTripDrawer'
import DeleteTripDialog from '../features/trips/components/DeleteTripDialog'
import { initialTrips } from '../features/trips/mock/trips'
import { Button, IconButton, Logo, Select } from '../ui'
import { readJSON, writeJSON } from '../utils/storage'
import styles from './DashboardHeader.module.css'

const CREATE_TRIP_OPEN_KEY = 'tripflow.session.isCreateTripOpen'
const ADD_EXPENSE_OPEN_KEY = 'tripflow.session.isAddExpenseOpen'
// Viajes semilla (ej. "Cartagena de Indias") — no se pueden eliminar, a
// diferencia de los viajes que el usuario crea con "Nuevo viaje". Evita perder
// el viaje de ejemplo por accidente; no aplica a nada creado por el usuario.
const SEED_TRIP_IDS = new Set(initialTrips.map((trip) => trip.id))

function DashboardHeader({
  showMenuButton = false,
  onMenuClick,
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onCreateExpense,
  onDeleteTrip,
}) {
  // sessionStorage (no localStorage): si iOS Safari recarga la pestaña al volver
  // de background, el Drawer que estaba abierto se vuelve a abrir solo; se limpia
  // al cerrar la pestaña de verdad, a diferencia de los datos del producto.
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(() =>
    readJSON(sessionStorage, CREATE_TRIP_OPEN_KEY, false),
  )
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(() =>
    readJSON(sessionStorage, ADD_EXPENSE_OPEN_KEY, false),
  )
  // No se persiste en sessionStorage a propósito: es una confirmación de una
  // acción destructiva, no debería "reaparecer" sola si el usuario vuelve a
  // background y regresa (a diferencia de los Drawers de creación).
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? null
  const isDemoTrip = Boolean(activeTrip && SEED_TRIP_IDS.has(activeTrip.id))

  useEffect(() => {
    writeJSON(sessionStorage, CREATE_TRIP_OPEN_KEY, isCreateTripOpen)
  }, [isCreateTripOpen])

  useEffect(() => {
    writeJSON(sessionStorage, ADD_EXPENSE_OPEN_KEY, isAddExpenseOpen)
  }, [isAddExpenseOpen])

  return (
    <header className={styles.header}>
      {showMenuButton && (
        <div className={styles.mobileTopRow}>
          <IconButton
            icon={<span aria-hidden="true">☰</span>}
            label="Abrir menú"
            onClick={onMenuClick}
          />
          <Logo iconClassName={styles.mobileLogoIcon} wordmarkClassName={styles.mobileLogoWordmark} />
        </div>
      )}

      <div className={styles.greetingRow}>
        <div className={styles.greeting}>
          <p className={styles.greetingHighlight}>Hola, Amy</p>
          <p className={styles.greetingText}>Así va tu presupuesto de viaje</p>
        </div>
      </div>

      <div className={styles.actions}>
        <span className={styles.actionsLabel}>Mis viajes</span>

        <div className={styles.selectorRow}>
          <Select
            id="trip-selector"
            aria-label="Viaje activo"
            value={activeTripId}
            onChange={(event) => onSelectTrip(event.target.value)}
            className={styles.tripSelect}
          >
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </Select>

          <IconButton
            icon={<img src={deleteIcon} alt="" />}
            label={isDemoTrip ? 'El viaje de ejemplo no se puede eliminar' : 'Eliminar viaje'}
            variant="outline"
            size="large"
            disabled={!activeTrip || isDemoTrip}
            onClick={() => setIsDeleteDialogOpen(true)}
          />
        </div>

        <div className={styles.actionButtons}>
          <Button
            variant="secondary"
            icon={<img src={addDarkIcon} alt="" />}
            className={styles.actionButton}
            onClick={() => setIsCreateTripOpen(true)}
          >
            Nuevo viaje
          </Button>
          <Button
            variant="primary"
            icon={<img src={addWhiteIcon} alt="" />}
            className={styles.actionButton}
            onClick={() => setIsAddExpenseOpen(true)}
            disabled={!activeTrip}
          >
            Agregar gasto
          </Button>
        </div>
      </div>

      <CreateTripDrawer
        open={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        onCreate={onCreateTrip}
      />

      <AddExpenseDrawer
        open={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onCreate={onCreateExpense}
      />

      <DeleteTripDialog
        open={isDeleteDialogOpen}
        trip={activeTrip}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={(tripId) => {
          onDeleteTrip(tripId)
          setIsDeleteDialogOpen(false)
        }}
      />
    </header>
  )
}

export default DashboardHeader
