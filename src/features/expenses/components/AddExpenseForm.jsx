import { useId, useState } from 'react'
import { Button, Calendar, Input, Select } from '../../../ui'
import { categoryDefinitions } from '../mock/categories'
import { getTodayISO } from '../../../utils/date'
import { readJSON, removeItem, writeJSON } from '../../../utils/storage'
import documentScannerIcon from '../../../assets/scan/document-scanner.svg'
import ReceiptScanner from './ReceiptScanner'
import styles from './AddExpenseForm.module.css'

// sessionStorage (no localStorage): sobrevive a que iOS Safari recargue la
// pestaña al volver de background, pero se limpia al cerrar la pestaña de
// verdad — es un draft transitorio, no un dato persistente del producto.
const DRAFT_KEY = 'tripflow.session.addExpenseDraft'
const EMPTY_DRAFT = { amount: '', concept: '', category: '', date: '' }

// Las categorías que puede devolver el AI Scanner deben matchear exactamente las
// etiquetas reales del Select — si el modelo devuelve algo fuera de esta lista
// (o inventa una), se ignora ese campo (queda vacío) en vez de meter un valor
// que el <Select> no puede representar.
const VALID_CATEGORY_LABELS = new Set(categoryDefinitions.map((item) => item.label))
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function loadDraft() {
  const stored = readJSON(sessionStorage, DRAFT_KEY, null)
  const draft = stored && typeof stored === 'object' ? { ...EMPTY_DRAFT, ...stored } : EMPTY_DRAFT
  // La fecha de hoy solo se usa como default cuando no hay un draft/valor previo.
  return draft.date ? draft : { ...draft, date: getTodayISO() }
}

function AddExpenseForm({ onSubmit }) {
  const categorySelectId = useId()
  const [draft, setDraft] = useState(loadDraft)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const { amount, concept, category, date } = draft

  function updateDraft(patch) {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      writeJSON(sessionStorage, DRAFT_KEY, next)
      return next
    })
  }

  // Prellena SOLO los campos que el AI pudo determinar (no-null/no-vacío) — todo lo
  // demás queda exactamente como estaba (vacío o con su default), nunca se inventa
  // un valor. El usuario revisa y puede modificar cualquier campo antes de registrar
  // — este flujo nunca llama a onSubmit por sí mismo.
  function handleScanExtracted(data) {
    const patch = {}
    if (typeof data?.amount === 'number' && Number.isFinite(data.amount) && data.amount > 0) {
      patch.amount = String(data.amount)
    }
    if (typeof data?.concept === 'string' && data.concept.trim()) {
      patch.concept = data.concept.trim()
    }
    if (typeof data?.category === 'string' && VALID_CATEGORY_LABELS.has(data.category)) {
      patch.category = data.category
    }
    if (typeof data?.date === 'string' && ISO_DATE_PATTERN.test(data.date)) {
      patch.date = data.date
    }
    if (Object.keys(patch).length > 0) updateDraft(patch)
    setIsScannerOpen(false)
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
        <div className={styles.amountFieldWrapper}>
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
            className={styles.amountInput}
            required
          />
          <button
            type="button"
            className={styles.scanTriggerButton}
            onClick={() => setIsScannerOpen(true)}
            aria-label="Escanear recibo con AI"
            title="Escanear recibo con AI"
          >
            <img src={documentScannerIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <Input
          label="Concepto o comercio (Opcional)"
          id="expense-concept"
          placeholder="Ej: Almuerzo, taxi, hotel..."
          value={concept}
          onChange={(event) => updateDraft({ concept: event.target.value })}
        />

        <Select
          label="Categoría (Opcional)"
          id={categorySelectId}
          value={category}
          onChange={(event) => updateDraft({ category: event.target.value })}
        >
          <option value="">Seleccionar...</option>
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

      {isScannerOpen && (
        <ReceiptScanner onExtracted={handleScanExtracted} onClose={() => setIsScannerOpen(false)} />
      )}
    </form>
  )
}

export default AddExpenseForm
