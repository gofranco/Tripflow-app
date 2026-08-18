import { useEffect, useRef, useState } from 'react'
import { readJSON, writeJSON } from '../../utils/storage'
import { resolveBudgetAlertState } from './components/budgetAlertStates'

// sessionStorage (no localStorage): el "ya viste esta alerta" es UI transitoria de
// la sesión actual, igual que los drafts de formulario y los flags de Drawer abierto
// — sobrevive a un reload/background-reload de iOS Safari, pero no tiene por qué
// perseguir al usuario para siempre entre sesiones reales.
const ACK_KEY = 'tripflow.session.budgetAlertAcknowledged'

function readAckMap() {
  return readJSON(sessionStorage, ACK_KEY, {})
}

function writeAckState(tripId, stateKey) {
  const ackMap = readAckMap()
  writeJSON(sessionStorage, ACK_KEY, { ...ackMap, [tripId]: stateKey })
}

// Deriva el estado de alerta a mostrar (o null) a partir del percentUsed YA
// calculado por useActiveTripSummary — no recalcula spent/budgetTotal/percentUsed,
// solo decide CUÁNDO surfacear el popup para ese número: la primera vez que se
// observa un viaje (mount o cambio de activeTripId) solo establece la base de
// comparación en silencio (nunca abre el popup por eso, aunque ya esté en una
// banda de alerta) — el popup solo aparece cuando, DESPUÉS de esa base, el estado
// cambia a uno nuevo (ej. un gasto nuevo empuja el % a la siguiente banda). Esto
// evita que aparezca por simplemente renderizar/recargar la página, y evita
// repetirlo mientras el viaje se quede en la misma banda.
export function useBudgetAlertTrigger(tripId, percentUsed) {
  const [alertState, setAlertState] = useState(null)
  const tripRef = useRef(undefined)
  const lastStateKeyRef = useRef(null)

  useEffect(() => {
    const currentState = resolveBudgetAlertState(percentUsed)
    const currentKey = currentState?.key ?? null

    if (tripRef.current !== tripId) {
      // Primer cálculo para este viaje (mount inicial o cambio de activeTripId):
      // arranca desde lo ya reconocido en esta sesión para ESE viaje (si lo hay),
      // o desde el estado actual si es la primera vez que se ve — nunca dispara.
      tripRef.current = tripId
      lastStateKeyRef.current = readAckMap()[tripId] ?? currentKey
      return
    }

    if (currentKey && currentKey !== lastStateKeyRef.current) {
      lastStateKeyRef.current = currentKey
      setAlertState(currentState)
    }
  }, [tripId, percentUsed])

  function dismiss() {
    if (alertState) writeAckState(tripId, alertState.key)
    setAlertState(null)
  }

  return { alertState, dismiss }
}
