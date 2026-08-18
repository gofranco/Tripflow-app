import { useMemo } from 'react'
import { toISODate } from '../../utils/date'
import styles from './Calendar.module.css'

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

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
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

// mode="range": startDate/endDate (strings ISO) + onChange({startDate, endDate}).
// mode="single": value (string ISO) + onChange(iso).
function Calendar({ mode = 'range', startDate, endDate, value, onChange, monthsToShow = 6 }) {
  const months = useMemo(() => {
    const today = new Date()
    const base = new Date(today.getFullYear(), today.getMonth(), 1)
    return Array.from({ length: monthsToShow }, (_, index) => {
      const date = new Date(base.getFullYear(), base.getMonth() + index, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }, [monthsToShow])

  function handleDayClick(iso) {
    if (mode === 'single') {
      onChange(iso)
      return
    }

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

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.scrollArea}
        role="group"
        aria-label={mode === 'single' ? 'Selecciona una fecha' : 'Selecciona fecha de inicio y regreso'}
      >
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

                  let rangeSegment = null
                  let stateLabel = ''
                  let isSelected

                  if (mode === 'single') {
                    isSelected = iso === value
                    if (isSelected) stateLabel = ', seleccionado'
                  } else {
                    const hasRange = Boolean(startDate) && Boolean(endDate)
                    const isStart = iso === startDate
                    const isEnd = Boolean(endDate) && iso === endDate
                    const isMiddle = hasRange && iso > startDate && iso < endDate
                    isSelected = isStart || isEnd

                    // La franja empieza/termina exactamente en el centro de la celda del
                    // extremo (= centro del círculo, que está centrado en el botón):
                    // rangeStart cubre la mitad derecha con esquina redondeada a la
                    // izquierda, rangeEnd la mitad izquierda con esquina redondeada a la
                    // derecha, rangeMiddle cubre toda la celda.
                    if (isMiddle) rangeSegment = styles.rangeMiddle
                    else if (isStart && hasRange) rangeSegment = styles.rangeStart
                    else if (isEnd) rangeSegment = styles.rangeEnd

                    if (isStart) stateLabel = ', fecha de inicio'
                    else if (isEnd) stateLabel = ', fecha de regreso'
                  }

                  const numberClassName = [styles.dayNumber, isSelected ? styles.daySelected : '']
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <button
                      key={iso}
                      type="button"
                      className={styles.day}
                      onClick={() => handleDayClick(iso)}
                      aria-pressed={isSelected}
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
    </div>
  )
}

export default Calendar
