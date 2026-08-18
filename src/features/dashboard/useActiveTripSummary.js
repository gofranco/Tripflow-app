import { useMemo } from 'react'
import { categoryDefinitions } from '../expenses/mock/categories'

const RECENT_EXPENSES_LIMIT = 6

// Única fuente de verdad para los datos derivados del Dashboard: filtra los
// gastos del viaje activo y calcula spent/disponible/%/categorías/recientes a
// partir de ellos. Ningún componente debe volver a sumar gastos por su cuenta.
export function useActiveTripSummary(activeTrip, expenses) {
  return useMemo(() => {
    const tripExpenses = expenses.filter((expense) => expense.tripId === activeTrip.id)

    const spent = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const available = activeTrip.budgetTotal - spent
    const percentUsed = activeTrip.budgetTotal > 0 ? (spent / activeTrip.budgetTotal) * 100 : 0

    const totalsByCategory = new Map()
    tripExpenses.forEach((expense) => {
      const label = expense.category || 'Otros'
      totalsByCategory.set(label, (totalsByCategory.get(label) || 0) + expense.amount)
    })

    const categories = categoryDefinitions
      .filter((definition) => totalsByCategory.has(definition.label))
      .map((definition) => ({ ...definition, amount: totalsByCategory.get(definition.label) }))

    const recentExpenses = [...tripExpenses]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, RECENT_EXPENSES_LIMIT)

    return { spent, available, percentUsed, categories, recentExpenses }
  }, [activeTrip, expenses])
}
