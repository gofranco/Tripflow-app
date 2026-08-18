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
