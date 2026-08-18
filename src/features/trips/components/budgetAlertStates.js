import iconAtencion from '../../../assets/trips/alert-atencion.svg'
import iconCritico from '../../../assets/trips/alert-critico.svg'
import iconExcedido from '../../../assets/trips/alert-excedido.svg'
import iconModerado from '../../../assets/trips/alert-moderado.svg'
import iconUrgente from '../../../assets/trips/alert-urgente.svg'

// Los 5 estados y sus umbrales/copys/colores replican 1:1 el diseño real de Figma
// (Budget Alert Popup, nodo 155:1976 — un estado por variante). Es un sistema de
// severidad distinto al de TripBudgetBanner (7 bandas, tonos success/warning/danger):
// este popup es una interrupción puntual, no un status persistente, así que no
// comparte paleta ni umbrales con el banner — no se toca TripBudgetBanner.
const ALERT_STATES = [
  {
    key: 'moderado',
    minPercent: 61,
    maxPercent: 75,
    icon: iconModerado,
    iconBg: '#fef8e9',
    badgeBg: '#fef8e9',
    accentColor: '#e8ab26',
    label: 'Moderado',
    title: 'Alerta de Presupuesto',
    message: 'Has utilizado entre el 61% y 75% de tu presupuesto. Considera reducir gastos en las próximas actividades.',
    usedLabel: 'Presupuesto utilizado',
  },
  {
    key: 'atencion',
    minPercent: 76,
    maxPercent: 90,
    icon: iconAtencion,
    iconBg: '#fef1e9',
    badgeBg: '#fef1e9',
    accentColor: '#ed731f',
    label: 'Atención',
    title: 'Presupuesto Elevado',
    message: 'Tu presupuesto está entre el 76% y 90%. Te quedan pocos fondos disponibles para el resto del viaje.',
    usedLabel: 'Presupuesto utilizado',
  },
  {
    key: 'critico',
    minPercent: 91,
    maxPercent: 100,
    icon: iconCritico,
    iconBg: '#fdf0f0',
    badgeBg: '#fdf0f0',
    accentColor: '#de3333',
    label: 'Crítico',
    title: 'Presupuesto Crítico',
    message: 'Has utilizado entre el 91% y 100% de tu presupuesto. Estás a punto de agotar tus fondos.',
    usedLabel: 'Presupuesto utilizado',
  },
  {
    key: 'excedido',
    minPercent: 100.000001,
    maxPercent: 120,
    icon: iconExcedido,
    iconBg: '#fceaea',
    badgeBg: '#fceaea',
    accentColor: '#b82121',
    label: 'Excedido',
    title: 'Presupuesto Excedido',
    message: 'Has superado tu presupuesto total. Los gastos adicionales no estaban contemplados en la planificación.',
    usedLabel: 'Límite excedido',
  },
  {
    key: 'urgente',
    minPercent: 120.000001,
    maxPercent: Infinity,
    icon: iconUrgente,
    iconBg: '#f5ebeb',
    badgeBg: '#f5ebeb',
    accentColor: '#5c0e0e',
    label: 'Urgente',
    title: 'Exceso Elevado',
    message: 'El exceso sobre tu presupuesto es significativo. Revisa urgentemente tus gastos para evitar deudas.',
    usedLabel: 'Límite excedido',
  },
]

// Clasifica un percentUsed ya calculado (ver useActiveTripSummary) en uno de los 5
// estados de severidad — no recalcula spent/budgetTotal/percentUsed, solo mapea el
// número recibido a su configuración visual.
export function resolveBudgetAlertState(percentUsed) {
  if (!Number.isFinite(percentUsed)) return null
  return ALERT_STATES.find((state) => percentUsed >= state.minPercent && percentUsed <= state.maxPercent) ?? null
}
