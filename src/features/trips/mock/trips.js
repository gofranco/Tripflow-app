// Semilla en memoria — sin persistencia. Los viajes creados desde el Drawer
// "Nuevo viaje" se agregan a esta lista vía estado de React (no se escribe aquí).
export const initialTrips = [
  {
    id: 'cartagena',
    name: 'Cartagena de Indias',
    startDate: '2026-08-07',
    endDate: '2026-08-14',
    budgetTotal: 4_000_000,
  },
]

// Destinos sugeridos para el campo de búsqueda del formulario "Nuevo viaje".
export const destinationSuggestions = [
  'Cartagena de Indias',
  'Medellín',
  'Bogotá',
  'Santa Marta',
  'San Andrés',
  'Cali',
  'Villa de Leyva',
  'Guatapé',
]
