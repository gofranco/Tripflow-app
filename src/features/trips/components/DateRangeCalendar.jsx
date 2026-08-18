import { useMemo } from 'react'
import styles from './DateRangeCalendar.module.css'

const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]
const DAY_HEADERS = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']
const MONTHS_TO_SHOW = 6

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(iso) {
  const [, month, day] = iso.split('-').map(Number)
  return `${capitalize(MONTH_NAMES[month - 1])} ${day}`
}

// Semana empieza en lunes, como en el calendario real de Figma.
function buildMonthWeeks(year, month) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function DateRangeCalendar({ startDate, endDate, onChange }) {
  const months = useMemo(() => {
    const today = new Date()
    const base = new Date(today.getFullYear(), today.getMonth(), 1)
    return Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
      const date = new Date(base.getFullYear(), base.getMonth() + index, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }, [])

  function handleDayClick(iso) {
    const startingNewRange = !startDate || (startDate && endDate) || iso < startDate

    if (startingNewRange) {
      onChange({ startDate: iso, endDate: '' })
      return
    }

    if (iso === startDate) {
      onChange({ startDate: iso, endDate: '' })
      return
    }

    onChange({ startDate, endDate: iso })
  }

  const summary =
    startDate && endDate
      ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
      : startDate
        ? `${formatDisplayDate(startDate)} - Selecciona la fecha de regreso`
        : 'Selecciona la fecha de inicio'

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollArea} role="group" aria-label="Selecciona fecha de inicio y regreso">
        {months.map(({ year, month }) => (
          <div key={`${year}-${month}`} className={styles.month}>
            <p className={styles.monthLabel}>
              {capitalize(MONTH_NAMES[month])} {year}
            </p>

            <div className={styles.dayHeaders}>
              {DAY_HEADERS.map((label, index) => (
                <span key={`${label}-${index}`} className={styles.dayHeader}>
                  {label}
                </span>
              ))}
            </div>

            {buildMonthWeeks(year, month).map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.map((date, dayIndex) => {
                  if (!date) return <span key={dayIndex} className={styles.emptyDay} aria-hidden="true" />

                  const iso = toISODate(date)
                  const hasRange = Boolean(startDate) && Boolean(endDate)
                  const isStart = iso === startDate
                  const isEnd = Boolean(endDate) && iso === endDate
                  const isMiddle = hasRange && iso > startDate && iso < endDate

                  // La franja empieza/termina exactamente en el centro de la celda del
                  // extremo (que coincide con el centro del círculo, ya que el círculo
                  // está centrado dentro del botón): rangeStart cubre la mitad derecha
                  // con esquina redondeada a la izquierda, rangeEnd la mitad izquierda
                  // con esquina redondeada a la derecha, rangeMiddle cubre toda la celda.
                  let rangeSegment = null
                  if (isMiddle) rangeSegment = styles.rangeMiddle
                  else if (isStart && hasRange) rangeSegment = styles.rangeStart
                  else if (isEnd) rangeSegment = styles.rangeEnd

                  const numberClassName = [styles.dayNumber, isStart || isEnd ? styles.daySelected : '']
                    .filter(Boolean)
                    .join(' ')

                  let stateLabel = ''
                  if (isStart) stateLabel = ', fecha de inicio'
                  else if (isEnd) stateLabel = ', fecha de regreso'

                  return (
                    <button
                      key={iso}
                      type="button"
                      className={styles.day}
                      onClick={() => handleDayClick(iso)}
                      aria-pressed={isStart || isEnd}
                      aria-label={`${date.getDate()} de ${MONTH_NAMES[month]} de ${year}${stateLabel}`}
                    >
                      {rangeSegment && <span className={rangeSegment} aria-hidden="true" />}
                      <span className={numberClassName}>{date.getDate()}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className={styles.summary} role="status">
        {summary}
      </p>
    </div>
  )
}

export default DateRangeCalendar
