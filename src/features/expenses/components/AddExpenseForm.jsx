import { useId, useState } from 'react'
import { Button, Calendar, Input, Select } from '../../../ui'
import { categoryDefinitions } from '../mock/categories'
import { getTodayISO } from '../../../utils/date'
import { readJSON, removeItem, writeJSON } from '../../../utils/storage'
import styles from './AddExpenseForm.module.css'

// sessionStorage (no localStorage): sobrevive a que iOS Safari recargue la
// pestaña al volver de background, pero se limpia al cerrar la pestaña de
// verdad — es un draft transitorio, no un dato persistente del producto.
const DRAFT_KEY = 'tripflow.session.addExpenseDraft'
const EMPTY_DRAFT = { amount: '', concept: '', category: '', date: '' }

function loadDraft() {
  const stored = readJSON(sessionStorage, DRAFT_KEY, null)
  const draft = stored && typeof stored === 'object' ? { ...EMPTY_DRAFT, ...stored } : EMPTY_DRAFT
  // La fecha de hoy solo se usa como default cuando no hay un draft/valor previo.
  return draft.date ? draft : { ...draft, date: getTodayISO() }
}

function AddExpenseForm({ onSubmit }) {
  const categorySelectId = useId()
  const [draft, setDraft] = useState(loadDraft)
  const { amount, concept, category, date } = draft

  function updateDraft(patch) {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      writeJSON(sessionStorage, DRAFT_KEY, next)
      return next
    })
  }

  const amountValue = Number(amount)
  const isValid = amount !== '' && amountValue > 0 && Boolean(date)

  function handleSubmit(event) {
    event.preventDefault()
    if (!isValid) return

    onSubmit({
      amount: amountValue,
      concept: concept.trim() || undefined,
      category: category || undefined,
      date,
    })
    removeItem(sessionStorage, DRAFT_KEY)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Región con su propio scroll — el footer queda fuera de ella, así que nunca
          compite con el calendario por el mismo espacio. */}
      <div className={styles.scrollableContent}>
        <Input
          label="Cuanto fue?"
          id="expense-amount"
          type="number"
          inputMode="numeric"
          min="0"
          step="1000"
          placeholder="Valor..."
          value={amount}
          onChange={(event) => updateDraft({ amount: event.target.value })}
          required
        />

        <Input
          label="Concepto o comercio (Opcional)"
          id="expense-concept"
          placeholder="Ej: Almuerzo, taxi, hotel..."
          value={concept}
          onChange={(event) => updateDraft({ concept: event.target.value })}
        />

        <Select
          label="Categoria (Optional)"
          id={categorySelectId}
          value={category}
          onChange={(event) => updateDraft({ category: event.target.value })}
        >
          <option value="">Select...</option>
          {categoryDefinitions.map((item) => (
            <option key={item.key} value={item.label}>
              {item.label}
            </option>
          ))}
        </Select>

        <p className={styles.sectionLabel}>Cuando?</p>
        <Calendar mode="single" value={date} onChange={(nextDate) => updateDraft({ date: nextDate })} />
      </div>

      <div className={styles.footer}>
        <Button type="submit" variant="primary" disabled={!isValid} className={styles.submitButton}>
          Registrar gasto
        </Button>
      </div>
    </form>
  )
}

export default AddExpenseForm
