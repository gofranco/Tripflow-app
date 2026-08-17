// Montos y orden replican el legend del "Donut Chart Card" en Figma.
// #2E90FA y #7A5AF8 son swatches locales provisionales: no existen en tokens.css
// porque Figma no documenta una paleta categórica para el chart.
export const expenseCategories = [
  { key: 'alojamiento', label: 'Alojamiento', amount: 750_000, color: 'var(--color-brand-primary)' },
  { key: 'alimentacion', label: 'Alimentación', amount: 500_000, color: 'var(--color-warning-default)' },
  { key: 'transporte', label: 'Transporte', amount: 350_000, color: '#2E90FA' },
  { key: 'actividades', label: 'Actividades', amount: 300_000, color: 'var(--color-success-default)' },
  { key: 'compras', label: 'Compras', amount: 250_000, color: '#7A5AF8' },
  { key: 'otros', label: 'Otros', amount: 200_000, color: 'var(--color-text-tertiary)' },
]
