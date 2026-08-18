import { Drawer } from '../../../ui'
import CreateTripForm from './CreateTripForm'
import styles from './CreateTripDrawer.module.css'

function CreateTripDrawer({ open, onClose, onCreate }) {
  function handleSubmit(tripData) {
    onCreate(tripData)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Nuevo viaje"
      side="right"
      panelClassName={styles.panel}
      titleClassName={styles.title}
      contentClassName={styles.content}
      closeLabel="Close"
      closeButtonClassName={styles.closeButton}
    >
      <CreateTripForm onSubmit={handleSubmit} />
    </Drawer>
  )
}

export default CreateTripDrawer
