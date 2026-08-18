import { useEffect, useState } from 'react'
import DashboardPage from './features/dashboard/DashboardPage'
import { initialTrips } from './features/trips/mock/trips'
import { AppShell } from './layouts'

function App() {
  const [trips, setTrips] = useState(initialTrips)
  const [activeTripId, setActiveTripId] = useState(initialTrips[0].id)
  // En memoria, sin persistencia — todavía no se conecta al Dashboard (Donut/Gastos
  // recientes siguen usando su propio mock, ver features/expenses/mock).
  const [expenses, setExpenses] = useState([])

  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0]

  function handleCreateTrip(tripData) {
    const newTrip = { id: `trip-${Date.now()}`, spent: 0, ...tripData }
    setTrips((prev) => [newTrip, ...prev])
    setActiveTripId(newTrip.id)
  }

  function handleCreateExpense(expenseData) {
    const newExpense = { id: `expense-${Date.now()}`, tripId: activeTrip.id, ...expenseData }
    setExpenses((prev) => [newExpense, ...prev])
  }

  // Verificación temporal para esta etapa (el Dashboard todavía no lee `expenses`):
  // confirma en la consola del navegador que el gasto se crea y queda asociado al
  // activeTripId. Quitar cuando expenses se conecte a una UI real.
  useEffect(() => {
    if (expenses.length > 0) console.log('[Tripflow] Gastos en memoria:', expenses)
  }, [expenses])

  return (
    <AppShell
      trips={trips}
      activeTripId={activeTrip.id}
      onSelectTrip={setActiveTripId}
      onCreateTrip={handleCreateTrip}
      onCreateExpense={handleCreateExpense}
    >
      <DashboardPage activeTrip={activeTrip} />
    </AppShell>
  )
}

export default App
