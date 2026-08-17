import addDarkIcon from '../assets/dashboard/icon-add-dark.svg'
import addWhiteIcon from '../assets/dashboard/icon-add-white.svg'
import deleteIcon from '../assets/dashboard/icon-delete.svg'
import { Button, IconButton, Select } from '../ui'
import styles from './DashboardHeader.module.css'

// Datos estáticos — la lista real de viajes vendrá de features/trips en una etapa posterior.
const TRIPS = [
  { id: 'cartagena', name: 'Cartagena de Indias' },
  { id: 'medellin', name: 'Medellín' },
  { id: 'bogota', name: 'Bogotá' },
]

function DashboardHeader({ showMenuButton = false, onMenuClick }) {
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
          defaultValue={TRIPS[0].id}
          className={styles.tripSelect}
        >
          {TRIPS.map((trip) => (
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

        <Button variant="secondary" icon={<img src={addDarkIcon} alt="" />}>
          Nuevo viaje
        </Button>
        <Button variant="primary" icon={<img src={addWhiteIcon} alt="" />}>
          Agregar gasto
        </Button>
      </div>
    </header>
  )
}

export default DashboardHeader
