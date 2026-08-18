// Helpers genéricos de localStorage — no saben nada de trips/expenses.
// Cualquier fallo (JSON inválido, storage deshabilitado, cuota excedida) se
// resuelve devolviendo/ignorando en silencio en vez de romper la app.
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage no disponible o cuota excedida: la app sigue funcionando solo en memoria.
  }
}
