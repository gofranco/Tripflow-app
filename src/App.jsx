import { useEffect, useState } from 'react'
import DashboardPage from './features/dashboard/DashboardPage'
import { initialExpenses } from './features/expenses/mock/seedExpenses'
import EmptyTripsState from './features/trips/components/EmptyTripsState'
import { initialTrips } from './features/trips/mock/trips'
import { AppShell } from './layouts'
import { readJSON, writeJSON } from './utils/storage'

const TRIPS_KEY = 'tripflow.trips'
const ACTIVE_TRIP_ID_KEY = 'tripflow.activeTripId'
const EXPENSES_KEY = 'tripflow.expenses'

function loadInitialTrips() {
  const stored = readJSON(localStorage, TRIPS_KEY, null)
  // Array.isArray solo (sin ".length > 0"): un array vacío es un estado real
  // y válido (el usuario eliminó todos sus viajes) — debe respetarse tal cual,
  // no tratarse como "nunca hubo datos" y resucitar la semilla demo.
  return Array.isArray(stored) ? stored : initialTrips
}

function loadInitialActiveTripId(trips) {
  const stored = readJSON(localStorage, ACTIVE_TRIP_ID_KEY, null)
  if (trips.some((trip) => trip.id === stored)) return stored
  return trips[0]?.id ?? null
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

  // A diferencia de las demás etapas, acá SÍ puede no haber ningún viaje activo
  // (justo después de eliminar el último) — trips[0] puede ser undefined.
  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0] ?? null

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

  // Elimina el viaje y sus gastos asociados. Si era el viaje activo, selecciona
  // automáticamente otro existente (o ninguno, si era el último) — el Dashboard
  // se actualiza solo porque activeTrip se deriva de activeTripId en cada render.
  function handleDeleteTrip(tripId) {
    const remainingTrips = trips.filter((trip) => trip.id !== tripId)
    setTrips(remainingTrips)
    setExpenses((prev) => prev.filter((expense) => expense.tripId !== tripId))
    if (activeTripId === tripId) {
      setActiveTripId(remainingTrips[0]?.id ?? null)
    }
  }

  return (
    <AppShell
      trips={trips}
      activeTripId={activeTrip?.id ?? null}
      onSelectTrip={setActiveTripId}
      onCreateTrip={handleCreateTrip}
      onCreateExpense={handleCreateExpense}
      onDeleteTrip={handleDeleteTrip}
    >
      {activeTrip ? <DashboardPage activeTrip={activeTrip} expenses={expenses} /> : <EmptyTripsState />}
    </AppShell>
  )
}

export default App
