import { Drawer } from '../../../ui'
import AddExpenseForm from './AddExpenseForm'
import styles from './AddExpenseDrawer.module.css'

function AddExpenseDrawer({ open, onClose, onCreate }) {
  function handleSubmit(expenseData) {
    onCreate(expenseData)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Registrar gasto"
      side="right"
      panelClassName={styles.panel}
      titleClassName={styles.title}
      contentClassName={styles.content}
      closeLabel="Close"
      closeButtonClassName={styles.closeButton}
    >
      <AddExpenseForm onSubmit={handleSubmit} />
    </Drawer>
  )
}

export default AddExpenseDrawer
