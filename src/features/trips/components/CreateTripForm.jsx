import { useEffect, useRef, useState } from 'react'
import { Button, Calendar, Input } from '../../../ui'
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY, resolveCurrency } from '../../../utils/currency'
import { formatShortDate, getTodayISO } from '../../../utils/date'
import { readJSON, removeItem, writeJSON } from '../../../utils/storage'
import { destinationSuggestions } from '../mock/trips'
import styles from './CreateTripForm.module.css'

// sessionStorage (no localStorage): sobrevive a que iOS Safari recargue la
// pestaña al volver de background, pero se limpia al cerrar la pestaña de
// verdad — es un draft transitorio, no un dato persistente del producto.
const DRAFT_KEY = 'tripflow.session.createTripDraft'
const EMPTY_DRAFT = { destination: '', startDate: '', endDate: '', budget: '', currency: DEFAULT_CURRENCY }

function loadDraft() {
  const stored = readJSON(sessionStorage, DRAFT_KEY, null)
  const draft = stored && typeof stored === 'object' ? { ...EMPTY_DRAFT, ...stored } : EMPTY_DRAFT
  // La fecha de hoy solo se usa como default cuando no hay un draft/valor previo
  // (ni guardado en sessionStorage ni ya elegido por el usuario en esta carga).
  const withDate = draft.startDate ? draft : { ...draft, startDate: getTodayISO() }
  // Un draft de sessionStorage anterior a este selector (o corrupto) puede no
  // traer `currency` o traer un código no soportado.
  return { ...withDate, currency: resolveCurrency(withDate.currency) }
}

function CreateTripForm({ onSubmit }) {
  const [draft, setDraft] = useState(loadDraft)
  // Lista de sugerencias propia en vez de <datalist> nativo: el popover de
  // datalist lo dibuja el navegador y no se puede estilar en ningún browser
  // (ni ancho, ni radius, ni tipografía) — por eso nunca calzaba con el input.
  const [isDestinationOpen, setIsDestinationOpen] = useState(false)
  const destinationWrapperRef = useRef(null)
  const { destination, startDate, endDate, budget, currency } = draft

  function updateDraft(patch) {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      writeJSON(sessionStorage, DRAFT_KEY, next)
      return next
    })
  }

  const trimmedDestination = destination.trim()
  const budgetValue = Number(budget)
  const filteredDestinations = trimmedDestination
    ? destinationSuggestions.filter((place) => place.toLowerCase().includes(trimmedDestination.toLowerCase()))
    : destinationSuggestions
  const showDestinationSuggestions = isDestinationOpen && filteredDestinations.length > 0

  // Cierra al hacer click afuera o con Escape — mismo patrón ya usado en otros
  // overlays de la app (Drawer, popups).
  useEffect(() => {
    if (!isDestinationOpen) return
    function handleClickOutside(event) {
      if (destinationWrapperRef.current && !destinationWrapperRef.current.contains(event.target)) {
        setIsDestinationOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsDestinationOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDestinationOpen])

  function handleSelectDestination(place) {
    updateDraft({ destination: place })
    setIsDestinationOpen(false)
  }

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
      currency,
    })
    removeItem(sessionStorage, DRAFT_KEY)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.destinationWrapper} ref={destinationWrapperRef}>
        <Input
          label="A dónde quieres viajar?"
          id="trip-destination"
          placeholder="Destino..."
          value={destination}
          onChange={(event) => {
            updateDraft({ destination: event.target.value })
            setIsDestinationOpen(true)
          }}
          onFocus={() => setIsDestinationOpen(true)}
          autoComplete="off"
          required
        />
        {showDestinationSuggestions && (
          <ul className={styles.destinationSuggestions} role="listbox" aria-label="Destinos sugeridos">
            {filteredDestinations.map((place) => (
              <li key={place} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={place === destination}
                  className={styles.destinationSuggestionItem}
                  onClick={() => handleSelectDestination(place)}
                >
                  {place}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.calendarHeader}>
        <p className={styles.sectionLabel}>Cuando?</p>
        <p className={styles.dateStatus} role="status">
          {dateStatus}
        </p>
      </div>
      <Calendar mode="range" startDate={startDate} endDate={endDate} onChange={handleDateRangeChange} />

      <div className={styles.budgetHeader}>
        <span>Presupuesto del viaje</span>
        <select
          id="trip-currency"
          aria-label="Moneda del viaje"
          className={styles.currencySelect}
          value={currency}
          onChange={(event) => updateDraft({ currency: event.target.value })}
        >
          {CURRENCY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.code}
            </option>
          ))}
        </select>
      </div>
      <Input
        id="trip-budget"
        type="number"
        inputMode="numeric"
        min="0"
        step="10000"
        placeholder={`$0 ${currency}`}
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
