import { useId, useState } from 'react'
import { Button, Calendar, Input } from '../../../ui'
import { formatShortDate, getTodayISO } from '../../../utils/date'
import { readJSON, removeItem, writeJSON } from '../../../utils/storage'
import { destinationSuggestions } from '../mock/trips'
import styles from './CreateTripForm.module.css'

// sessionStorage (no localStorage): sobrevive a que iOS Safari recargue la
// pestaña al volver de background, pero se limpia al cerrar la pestaña de
// verdad — es un draft transitorio, no un dato persistente del producto.
const DRAFT_KEY = 'tripflow.session.createTripDraft'
const EMPTY_DRAFT = { destination: '', startDate: '', endDate: '', budget: '' }

function loadDraft() {
  const stored = readJSON(sessionStorage, DRAFT_KEY, null)
  const draft = stored && typeof stored === 'object' ? { ...EMPTY_DRAFT, ...stored } : EMPTY_DRAFT
  // La fecha de hoy solo se usa como default cuando no hay un draft/valor previo
  // (ni guardado en sessionStorage ni ya elegido por el usuario en esta carga).
  return draft.startDate ? draft : { ...draft, startDate: getTodayISO() }
}

function CreateTripForm({ onSubmit }) {
  const destinationListId = useId()
  const [draft, setDraft] = useState(loadDraft)
  const { destination, startDate, endDate, budget } = draft

  function updateDraft(patch) {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      writeJSON(sessionStorage, DRAFT_KEY, next)
      return next
    })
  }

  const trimmedDestination = destination.trim()
  const budgetValue = Number(budget)

  // El Calendar en mode="range" ya impide elegir un regreso anterior al inicio,
  // pero un draft restaurado desde sessionStorage podría llegar inconsistente
  // (ej. de una versión anterior) — se valida igual por seguridad.
  const isValid =
    trimmedDestination.length > 0 &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    endDate >= startDate &&
    budget !== '' &&
    budgetValue > 0

  function handleDateRangeChange({ startDate: nextStart, endDate: nextEnd }) {
    updateDraft({ startDate: nextStart, endDate: nextEnd })
  }

  const dateStatus =
    startDate && endDate
      ? `${formatShortDate(startDate)} — ${formatShortDate(endDate)}`
      : startDate
        ? 'Selecciona la fecha de regreso'
        : 'Selecciona la fecha de inicio'

  function handleSubmit(event) {
    event.preventDefault()
    if (!isValid) return

    onSubmit({
      name: trimmedDestination,
      startDate,
      endDate,
      budgetTotal: budgetValue,
    })
    removeItem(sessionStorage, DRAFT_KEY)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="A dónde quieres viajar?"
        id="trip-destination"
        list={destinationListId}
        placeholder="Destino..."
        value={destination}
        onChange={(event) => updateDraft({ destination: event.target.value })}
        autoComplete="off"
        required
      />
      <datalist id={destinationListId}>
        {destinationSuggestions.map((place) => (
          <option key={place} value={place} />
        ))}
      </datalist>

      <div className={styles.calendarHeader}>
        <p className={styles.sectionLabel}>Cuando?</p>
        <p className={styles.dateStatus} role="status">
          {dateStatus}
        </p>
      </div>
      <Calendar mode="range" startDate={startDate} endDate={endDate} onChange={handleDateRangeChange} />

      <div className={styles.budgetHeader}>
        <span>Presupuesto del viaje</span>
        <span className={styles.budgetUnit}>COP</span>
      </div>
      <Input
        id="trip-budget"
        type="number"
        inputMode="numeric"
        min="0"
        step="10000"
        placeholder="$0 COP"
        value={budget}
        onChange={(event) => updateDraft({ budget: event.target.value })}
        required
      />

      <Button type="submit" variant="primary" disabled={!isValid} className={styles.submitButton}>
        Crear viaje
      </Button>
    </form>
  )
}

export default CreateTripForm
