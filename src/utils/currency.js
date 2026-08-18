export function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

// Réplica del formato compacto visto en Figma ("$750K", "$2.35M").
export function formatCompactCOP(value) {
  const abs = Math.abs(value)

  if (abs >= 1_000_000) {
    const millions = (value / 1_000_000).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
    return `$${millions}M`
  }

  if (abs >= 1_000) {
    return `$${Math.round(value / 1_000)}K`
  }

  return `$${value}`
}

// Réplica del formato usado en "Gastos recientes" ("-45.000 cop"). Un amount
// corrupto (no numérico) en localStorage se trata como 0 — mismo criterio que el
// saneamiento de useActiveTripSummary, para no mostrar "-NaN cop".
export function formatExpenseAmount(value) {
  const safeValue = Number.isFinite(value) ? value : 0
  const formatted = new Intl.NumberFormat('es-CO').format(Math.abs(safeValue))
  return `-${formatted} cop`
}
