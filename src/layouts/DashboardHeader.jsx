import { useState } from 'react'
import addDarkIcon from '../assets/dashboard/icon-add-dark.svg'
import addWhiteIcon from '../assets/dashboard/icon-add-white.svg'
import deleteIcon from '../assets/dashboard/icon-delete.svg'
import AddExpenseDrawer from '../features/expenses/components/AddExpenseDrawer'
import CreateTripDrawer from '../features/trips/components/CreateTripDrawer'
import { Button, IconButton, Select } from '../ui'
import styles from './DashboardHeader.module.css'

function DashboardHeader({
  showMenuButton = false,
  onMenuClick,
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onCreateExpense,
}) {
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.greetingRow}>
        {showMenuButton && (
          <IconButton
            icon={<span aria-hidden="true">☰</span>}
            label="Abrir menú"
            onClick={onMenuClick}
            className={styles.menuButton}
          />
        )}
        <div className={styles.greeting}>
          <p className={styles.greetingHighlight}>Hola, Amy</p>
          <p className={styles.greetingText}>Así va tu presupuesto de viaje</p>
        </div>
      </div>

      <div className={styles.actions}>
        <span className={styles.actionsLabel}>Mis viajes</span>

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
