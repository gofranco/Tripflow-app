import { useMemo } from 'react'
import { resolveCurrency } from '../../utils/currency'
import { categoryDefinitions } from '../expenses/mock/categories'

const RECENT_EXPENSES_LIMIT = 6

// Cualquier número que pueda venir de localStorage (budgetTotal de un trip,
// amount de un expense) puede llegar corrupto (string no numérico, undefined,
// NaN, Infinity) si alguien edita el storage a mano — nunca debe propagar NaN/
// Infinity hacia los cálculos derivados. Se trata como 0 en ese caso.
function toFiniteNumber(value) {
  return Number.isFinite(value) ? value : 0
}

// Única fuente de verdad para los datos derivados del Dashboard: filtra los
// gastos del viaje activo y calcula spent/disponible/%/categorías/recientes a
// partir de ellos. Ningún componente debe volver a sumar gastos por su cuenta.
export function useActiveTripSummary(activeTrip, expenses) {
  return useMemo(() => {
    const tripExpenses = expenses.filter((expense) => expense.tripId === activeTrip.id)

    // budgetTotal inválido (0, negativo, o corrupto/no numérico) nunca debe
    // propagar NaN/Infinity hacia abajo — se trata como "sin presupuesto".
    const budgetTotal = toFiniteNumber(activeTrip.budgetTotal)

    // Viajes creados antes del selector de moneda (o con localStorage corrupto)
    // no tienen `currency` — se muestran en COP sin reescribir el viaje guardado.
    const currency = resolveCurrency(activeTrip.currency)

    const spent = tripExpenses.reduce((sum, expense) => sum + toFiniteNumber(expense.amount), 0)
    const available = budgetTotal - spent
    const percentUsed = budgetTotal > 0 ? (spent / budgetTotal) * 100 : 0

    const totalsByCategory = new Map()
    tripExpenses.forEach((expense) => {
      const label = expense.category || 'Otros'
      const amount = toFiniteNumber(expense.amount)
      totalsByCategory.set(label, (totalsByCategory.get(label) || 0) + amount)
    })

    const categories = categoryDefinitions
      .filter((definition) => totalsByCategory.has(definition.label))
      .map((definition) => ({ ...definition, amount: totalsByCategory.get(definition.label) }))

    const recentExpenses = [...tripExpenses]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, RECENT_EXPENSES_LIMIT)

    return { budgetTotal, spent, available, percentUsed, categories, recentExpenses, currency }
  }, [activeTrip, expenses])
}
