import { useState } from 'react'
import DashboardPage from './features/dashboard/DashboardPage'
import { initialExpenses } from './features/expenses/mock/seedExpenses'
import { initialTrips } from './features/trips/mock/trips'
import { AppShell } from './layouts'

function App() {
  const [trips, setTrips] = useState(initialTrips)
  const [activeTripId, setActiveTripId] = useState(initialTrips[0].id)
  // En memoria, sin persistencia. `spent` ya no vive en el viaje: se deriva de estos
  // gastos filtrados por tripId (ver features/dashboard/useActiveTripSummary).
  const [expenses, setExpenses] = useState(initialExpenses)

  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0]

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
