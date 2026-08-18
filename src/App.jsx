import { useEffect, useState } from 'react'
import DashboardPage from './features/dashboard/DashboardPage'
import { initialExpenses } from './features/expenses/mock/seedExpenses'
import { initialTrips } from './features/trips/mock/trips'
import { AppShell } from './layouts'
import { readJSON, writeJSON } from './utils/storage'

const TRIPS_KEY = 'tripflow.trips'
const ACTIVE_TRIP_ID_KEY = 'tripflow.activeTripId'
const EXPENSES_KEY = 'tripflow.expenses'

function loadInitialTrips() {
  const stored = readJSON(localStorage, TRIPS_KEY, null)
  return Array.isArray(stored) && stored.length > 0 ? stored : initialTrips
}

function loadInitialActiveTripId(trips) {
  const stored = readJSON(localStorage, ACTIVE_TRIP_ID_KEY, null)
  return trips.some((trip) => trip.id === stored) ? stored : trips[0].id
}

function loadInitialExpenses() {
  const stored = readJSON(localStorage, EXPENSES_KEY, null)
  return Array.isArray(stored) ? stored : initialExpenses
}

function App() {
  // Semilla desde localStorage (con validación defensiva); si no hay datos
  // guardados o están corruptos, se usan los datos demo actuales.
  const [trips, setTrips] = useState(loadInitialTrips)
  const [activeTripId, setActiveTripId] = useState(() => loadInitialActiveTripId(trips))
  // `spent` no vive aquí: se deriva de estos gastos filtrados por tripId
  // (ver features/dashboard/useActiveTripSummary).
  const [expenses, setExpenses] = useState(loadInitialExpenses)

  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0]

  // Persistencia: cada pieza de estado se guarda apenas cambia, sin importar
  // qué handler la haya originado (crear viaje, registrar gasto, cambiar de
  // viaje activo). App sigue siendo el único dueño del estado.
  useEffect(() => {
    writeJSON(localStorage, TRIPS_KEY, trips)
  }, [trips])

  useEffect(() => {
    writeJSON(localStorage, ACTIVE_TRIP_ID_KEY, activeTripId)
  }, [activeTripId])

  useEffect(() => {
    writeJSON(localStorage, EXPENSES_KEY, expenses)
  }, [expenses])

  function handleCreateTrip(tripData) {
    const newTrip = { id: `trip-${Date.now()}`, ...tripData }
    setTrips((prev) => [newTrip, ...prev])
    setActiveTripId(newTrip.id)
  }

  function handleCreateExpense(expenseData) {
    const newExpense = { id: `expense-${Date.now()}`, tripId: activeTrip.id, ...expenseData }
    setExpenses((prev) => [newExpense, ...prev])
  }

  return (
    <AppShell
      trips={trips}
      activeTripId={activeTrip.id}
      onSelectTrip={setActiveTripId}
      onCreateTrip={handleCreateTrip}
      onCreateExpense={handleCreateExpense}
    >
      <DashboardPage activeTrip={activeTrip} expenses={expenses} />
    </AppShell>
  )
}

export default App
