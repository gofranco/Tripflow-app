import { useEffect, useState } from 'react'
import addDarkIcon from '../assets/dashboard/icon-add-dark.svg'
import addWhiteIcon from '../assets/dashboard/icon-add-white.svg'
import deleteIcon from '../assets/dashboard/icon-delete.svg'
import logo from '../assets/dashboard/logo.png'
import AddExpenseDrawer from '../features/expenses/components/AddExpenseDrawer'
import CreateTripDrawer from '../features/trips/components/CreateTripDrawer'
import { Button, IconButton, Select } from '../ui'
import { readJSON, writeJSON } from '../utils/storage'
import styles from './DashboardHeader.module.css'

const CREATE_TRIP_OPEN_KEY = 'tripflow.session.isCreateTripOpen'
const ADD_EXPENSE_OPEN_KEY = 'tripflow.session.isAddExpenseOpen'

function DashboardHeader({
  showMenuButton = false,
  onMenuClick,
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onCreateExpense,
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
          <img src={logo} alt="Tripflow" className={styles.mobileLogo} />
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
            label="Eliminar viaje"
            variant="outline"
            size="large"
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
    </header>
  )
}

export default DashboardHeader
