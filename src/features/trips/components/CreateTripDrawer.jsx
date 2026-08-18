import { Drawer } from '../../../ui'
import CreateTripForm from './CreateTripForm'
import styles from './CreateTripDrawer.module.css'

function CreateTripDrawer({ open, onClose, onCreate }) {
  function handleSubmit(tripData) {
    onCreate(tripData)
    onClose()
    // El viaje nuevo pasa a ser el activo y el Dashboard se reconstruye con sus
    // datos — debe verse desde el header, no desde donde haya quedado el scroll
    // del formulario/calendario.
    window.scrollTo(0, 0)
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
