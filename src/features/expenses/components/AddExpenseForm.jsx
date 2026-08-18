import { useId, useState } from 'react'
import { Button, Calendar, Input, Select } from '../../../ui'
import { categoryDefinitions } from '../mock/categories'
import styles from './AddExpenseForm.module.css'

function AddExpenseForm({ onSubmit }) {
  const categorySelectId = useId()
  const [amount, setAmount] = useState('')
  const [concept, setConcept] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

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
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Cuanto fue?"
        id="expense-amount"
        type="number"
        inputMode="numeric"
        min="0"
        step="1000"
        placeholder="Valor..."
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        required
      />

      <Input
        label="Concepto o comercio (Opcional)"
        id="expense-concept"
        placeholder="Ej: Almuerzo, taxi, hotel..."
        value={concept}
        onChange={(event) => setConcept(event.target.value)}
      />

      <Select
        label="Categoria (Optional)"
        id={categorySelectId}
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="">Select...</option>
        {categoryDefinitions.map((item) => (
          <option key={item.key} value={item.label}>
            {item.label}
          </option>
        ))}
      </Select>

      <p className={styles.sectionLabel}>Cuando?</p>
      <Calendar mode="single" value={date} onChange={setDate} />

      <Button type="submit" variant="primary" disabled={!isValid} className={styles.submitButton}>
        Registrar gasto
      </Button>
    </form>
  )
}

export default AddExpenseForm
