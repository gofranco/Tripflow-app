// Montos, orden y colores replican 1:1 el legend del "Donut Chart Card" real en Figma
// (--category/accommodation, --category/food, --category/transport, etc.).
export const expenseCategories = [
  {
    key: 'alojamiento',
    label: 'Alojamiento',
    amount: 750_000,
    color: 'var(--color-category-accommodation)',
  },
  { key: 'alimentacion', label: 'Alimentación', amount: 500_000, color: 'var(--color-category-food)' },
  { key: 'transporte', label: 'Transporte', amount: 350_000, color: 'var(--color-category-transport)' },
  {
    key: 'actividades',
    label: 'Actividades',
    amount: 300_000,
    color: 'var(--color-category-activities)',
  },
  { key: 'compras', label: 'Compras', amount: 250_000, color: 'var(--color-category-shopping)' },
  { key: 'otros', label: 'Otros', amount: 200_000, color: 'var(--color-category-other)' },
]
