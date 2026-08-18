// Semilla en memoria del viaje demo (Cartagena) — gastos individuales reales, no
// agregados estáticos. De aquí se derivan spent/categorías/gastos recientes
// (ver features/dashboard/useActiveTripSummary), así que los números siempre
// cuadran entre sí por construcción.
//
// Las primeras 6 filas son literalmente las que ya se mostraban en "Gastos
// recientes" (mismo texto/fecha/monto). Las siguientes son cargos previos del
// mismo viaje que no aparecían en la vista "recientes" mostrada en Figma, pero
// que sí forman parte del total de $2.350.000 y del desglose por categoría
// (32/21/15/13/11/8%) ya aprobado en pasos anteriores.
export const initialExpenses = [
  {
    id: 'seed-1',
    tripId: 'cartagena',
    amount: 45_000,
    concept: 'Taxi a la ciudad amurallada',
    category: 'Transporte',
    date: '2026-08-10',
  },
  {
    id: 'seed-2',
    tripId: 'cartagena',
    amount: 85_000,
    concept: 'Almuerzo en Cafe del Mar',
    category: 'Alimentación',
    date: '2026-08-10',
  },
  {
    id: 'seed-3',
    tripId: 'cartagena',
    amount: 120_000,
    concept: 'Supermercados Éxito',
    category: 'Compras',
    date: '2026-08-08',
  },
  {
    id: 'seed-4',
    tripId: 'cartagena',
    amount: 750_000,
    concept: 'Hotel Casa San Agustín',
    category: 'Alojamiento',
    date: '2026-08-07',
  },
  {
    id: 'seed-5',
    tripId: 'cartagena',
    amount: 75_000,
    concept: 'Entrada Castillo San Felipe',
    category: 'Actividades',
    date: '2026-08-07',
  },
  {
    id: 'seed-6',
    tripId: 'cartagena',
    amount: 65_000,
    concept: 'Compra D1',
    category: 'Compras',
    date: '2026-08-07',
  },
  {
    id: 'seed-7',
    tripId: 'cartagena',
    amount: 305_000,
    concept: 'Vuelo Bogotá - Cartagena',
    category: 'Transporte',
    date: '2026-08-07',
  },
  {
    id: 'seed-8',
    tripId: 'cartagena',
    amount: 200_000,
    concept: 'Cena de bienvenida',
    category: 'Alimentación',
    date: '2026-08-07',
  },
  {
    id: 'seed-9',
    tripId: 'cartagena',
    amount: 215_000,
    concept: 'Desayunos del hotel',
    category: 'Alimentación',
    date: '2026-08-07',
  },
  {
    id: 'seed-10',
    tripId: 'cartagena',
    amount: 225_000,
    concept: 'Tour por la ciudad amurallada',
    category: 'Actividades',
    date: '2026-08-07',
  },
  {
    id: 'seed-11',
    tripId: 'cartagena',
    amount: 65_000,
    concept: 'Recuerdos y artesanías',
    category: 'Compras',
    date: '2026-08-07',
  },
  {
    id: 'seed-12',
    tripId: 'cartagena',
    amount: 200_000,
    concept: 'Seguro de viaje',
    category: 'Otros',
    date: '2026-08-07',
  },
]
