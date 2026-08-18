const SHORT_MONTH_NAMES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

// '2026-08-10' -> '10 Ago'
export function formatShortDate(iso) {
  const [, month, day] = iso.split('-').map(Number)
  return `${day} ${SHORT_MONTH_NAMES[month - 1]}`
}

// Date -> 'YYYY-MM-DD' usando los componentes locales del dispositivo (no UTC,
// a diferencia de Date#toISOString) — evita que la fecha "salte" de día cerca de
// medianoche según el timezone. Fuente única para ui/Calendar y los formularios
// que necesitan la fecha de hoy como default.
export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayISO() {
  return toISODate(new Date())
}
