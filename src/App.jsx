import { useState } from 'react'
import DashboardPage from './features/dashboard/DashboardPage'
import { initialTrips } from './features/trips/mock/trips'
import { AppShell } from './layouts'

function App() {
  const [trips, setTrips] = useState(initialTrips)
  const [activeTripId, setActiveTripId] = useState(initialTrips[0].id)

  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0]

  function handleCreateTrip(tripData) {
    const newTrip = { id: `trip-${Date.now()}`, spent: 0, ...tripData }
    setTrips((prev) => [newTrip, ...prev])
    setActiveTripId(newTrip.id)
  }

  return (
    <AppShell
      trips={trips}
      activeTripId={activeTrip.id}
      onSelectTrip={setActiveTripId}
      onCreateTrip={handleCreateTrip}
    >
      <DashboardPage activeTrip={activeTrip} />
    </AppShell>
  )
}

export default App
