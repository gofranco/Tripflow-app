// Definiciones canónicas de categoría (orden, color) — el monto ya NO vive aquí:
// se deriva de los gastos reales del viaje activo (ver features/dashboard/useActiveTripSummary).
export const categoryDefinitions = [
  { key: 'alojamiento', label: 'Alojamiento', color: 'var(--color-category-accommodation)' },
  { key: 'alimentacion', label: 'Alimentación', color: 'var(--color-category-food)' },
  { key: 'transporte', label: 'Transporte', color: 'var(--color-category-transport)' },
  { key: 'actividades', label: 'Actividades', color: 'var(--color-category-activities)' },
  { key: 'compras', label: 'Compras', color: 'var(--color-category-shopping)' },
  { key: 'otros', label: 'Otros', color: 'var(--color-category-other)' },
]
