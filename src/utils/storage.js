// Helpers genéricos de Web Storage — no saben nada de trips/expenses/UI. Reciben
// el engine (localStorage o sessionStorage) como parámetro para no duplicar la
// misma lógica de try/catch/JSON en cada lugar que necesite el otro tipo de storage.
// Cualquier fallo (JSON inválido, storage deshabilitado, cuota excedida) se
// resuelve devolviendo/ignorando en silencio en vez de romper la app.
export function readJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage no disponible o cuota excedida: la app sigue funcionando solo en memoria.
  }
}

export function removeItem(storage, key) {
  try {
    storage.removeItem(key)
  } catch {
    // Storage no disponible: no hay nada que limpiar.
  }
}
