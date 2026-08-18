// Monedas soportadas para el selector de "Presupuesto del viaje" (CreateTripForm).
// Cada viaje guarda su propio `currency` — no hay conversión de tasas, solo cambia
// el símbolo/código con el que se representan sus montos.
export const CURRENCY_OPTIONS = [
  { code: 'COP', label: 'COP — Peso colombiano' },
  { code: 'USD', label: 'USD — Dólar estadounidense' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'MXN', label: 'MXN — Peso mexicano' },
]

const CURRENCY_CODES = CURRENCY_OPTIONS.map((option) => option.code)
export const DEFAULT_CURRENCY = 'COP'

// Símbolo compacto por moneda, para formatCompactCOP (que arma el string a mano,
// no vía Intl). "$" cubre COP/USD/MXN (mismo símbolo, distinto código); EUR es el
// único con símbolo propio.
const CURRENCY_SYMBOLS = { COP: '$', USD: '$', EUR: '€', MXN: '$' }

// Viajes creados antes de que existiera el selector de moneda (o con localStorage
// editado a mano) pueden no tener `currency`, o tener un código no soportado —
// se tratan como COP (el comportamiento histórico del proyecto) sin reescribir el
// dato guardado, mismo criterio que el saneamiento de amount/budgetTotal.
export function resolveCurrency(currency) {
  return CURRENCY_CODES.includes(currency) ? currency : DEFAULT_CURRENCY
}

export function formatCOP(value, currency = DEFAULT_CURRENCY) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: resolveCurrency(currency),
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(value)
}

// Réplica del formato compacto visto en Figma ("$750K", "$2.35M"), ahora con el
// símbolo de la moneda del viaje en vez de "$" fijo.
export function formatCompactCOP(value, currency = DEFAULT_CURRENCY) {
  const symbol = CURRENCY_SYMBOLS[resolveCurrency(currency)]
  const abs = Math.abs(value)

  if (abs >= 1_000_000) {
    const millions = (value / 1_000_000).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
    return `${symbol}${millions}M`
  }

  if (abs >= 1_000) {
    return `${symbol}${Math.round(value / 1_000)}K`
  }

  return `${symbol}${value}`
}

// Réplica del formato usado en "Gastos recientes" ("-45.000 cop"). Un amount
// corrupto (no numérico) en localStorage se trata como 0 — mismo criterio que el
// saneamiento de useActiveTripSummary, para no mostrar "-NaN cop".
export function formatExpenseAmount(value, currency = DEFAULT_CURRENCY) {
  const safeValue = Number.isFinite(value) ? value : 0
  const formatted = new Intl.NumberFormat('es-CO').format(Math.abs(safeValue))
  return `-${formatted} ${resolveCurrency(currency).toLowerCase()}`
}
