import { useId, useState } from 'react'
import { Button, Input } from '../../../ui'
import DateRangeCalendar from './DateRangeCalendar'
import { destinationSuggestions } from '../mock/trips'
import styles from './CreateTripForm.module.css'

function CreateTripForm({ onSubmit }) {
  const destinationListId = useId()
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')

  const trimmedDestination = destination.trim()
  const budgetValue = Number(budget)

  const isValid =
    trimmedDestination.length > 0 &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    budget !== '' &&
    budgetValue > 0

  function handleDateRangeChange({ startDate: nextStart, endDate: nextEnd }) {
    setStartDate(nextStart)
    setEndDate(nextEnd)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!isValid) return

    onSubmit({
      name: trimmedDestination,
      startDate,
      endDate,
      budgetTotal: budgetValue,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="A dónde quieres viajar?"
        id="trip-destination"
        list={destinationListId}
        placeholder="Destino..."
        value={destination}
        onChange={(event) => setDestination(event.target.value)}
        autoComplete="off"
        required
      />
      <datalist id={destinationListId}>
        {destinationSuggestions.map((place) => (
          <option key={place} value={place} />
        ))}
      </datalist>

      <p className={styles.sectionLabel}>Cuando?</p>
      <DateRangeCalendar startDate={startDate} endDate={endDate} onChange={handleDateRangeChange} />

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
        onChange={(event) => setBudget(event.target.value)}
        required
      />

      <Button type="submit" variant="primary" disabled={!isValid} className={styles.submitButton}>
        Crear viaje
      </Button>
    </form>
  )
}

export default CreateTripForm
