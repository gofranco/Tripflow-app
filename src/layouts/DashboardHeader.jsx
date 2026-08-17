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
      <div className={styles.left}>
        {showMenuButton && (
          <IconButton
            icon={<span aria-hidden="true">☰</span>}
            label="Abrir menú"
            onClick={onMenuClick}
          />
        )}
        <Select id="trip-selector" aria-label="Viaje activo" defaultValue={TRIPS[0].id} className={styles.tripSelect}>
          {TRIPS.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </Select>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary">Nuevo viaje</Button>
        <Button variant="primary">Agregar gasto</Button>
      </div>
    </header>
  )
}

export default DashboardHeader
