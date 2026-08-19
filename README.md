# Tripflow

Tripflow es una aplicación web para ayudar a las personas a planificar sus viajes, registrar sus gastos y mantener el control de su presupuesto durante el viaje.

El principio de diseño detrás del producto es simple: **reducir la fricción entre gastar y registrar.**

## Demo

🔗 [https://tripflowdiegofranco.netlify.app](https://tripflowdiegofranco.netlify.app)

## Funcionalidades principales

- Crear y gestionar viajes
- Definir presupuesto por viaje
- Seleccionar la moneda del viaje (COP, USD, EUR, MXN)
- Registrar gastos (monto, concepto, categoría, fecha)
- Visualizar presupuesto gastado y disponible, con desglose por categoría
- Alertas de presupuesto según el porcentaje utilizado
- Eliminar viajes con confirmación (elimina también sus gastos asociados)
- Responsive en desktop, tablet y mobile
- **Trip AI**: escaneo de recibos con IA para prellenar el formulario de gasto
- Persistencia local (localStorage) — los datos sobreviven a recargar la página

## Tecnologías

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 8
- JavaScript (ES Modules)
- CSS / CSS Modules
- [Node.js](https://nodejs.org/) (backend del scanner, vía `node:http`)
- [OpenAI API](https://platform.openai.com/) (`gpt-4o-mini`, para la extracción de datos de recibos)
- Git / GitHub
- [Netlify](https://www.netlify.com/) (hosting del frontend)
- [Render](https://render.com/) (hosting del backend)

## Instalación local

### Requisitos

- Node.js **20.6 o superior**. El backend usa `process.loadEnvFile()`, disponible de forma nativa desde esa versión (sin depender de `dotenv`).

### Clonar repositorio

```bash
git clone https://github.com/gofranco/Tripflow-app.git
cd tripflow-app
```

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Crear un archivo `.env` en la **raíz del proyecto** (mismo nivel que `package.json`), a partir de `.env.example`:

```bash
OPENAI_API_KEY=sk-...
```

Esta variable la lee únicamente `server/index.js` (el backend). Reglas importantes:

- `OPENAI_API_KEY` pertenece **exclusivamente al backend** — nunca se referencia desde código que corra en el navegador.
- Nunca debe declararse como `VITE_*` (cualquier variable con ese prefijo queda embebida en el bundle del frontend).
- Nunca debe aparecer en el frontend ni en `dist/`.
- Nunca debe subirse al repositorio: `.env` está en `.gitignore`; solo `.env.example` (con un placeholder) queda versionado.

### Ejecutar backend

```bash
npm run server
```

Levanta `server/index.js` en `http://localhost:8787` (puerto por defecto; configurable con la variable `PORT`), exponiendo `POST /api/scan-receipt`.

### Ejecutar frontend

```bash
npm run dev
```

En desarrollo, Vite proxea las requests a `/api/*` hacia `http://localhost:8787` (ver `vite.config.js`), así el frontend llama a `/api/scan-receipt` sin preocuparse por CORS ni por la URL real del backend.

## Trip AI — Escáner de recibos

Registrar un gasto a mano después de cada compra es la principal fuente de fricción durante un viaje. Trip AI resuelve eso: el usuario captura la foto de un recibo y la IA extrae los datos por él.

Flujo:

1. El usuario abre "Agregar gasto" y toca el ícono de escaneo.
2. Captura una foto del recibo desde la cámara del dispositivo.
3. La imagen se procesa y la IA extrae `amount`, `concept`, `category` y `date`.
4. Esos datos prellenan el formulario de gasto — el usuario puede revisarlos y editarlos libremente antes de continuar.
5. El scanner **nunca registra el gasto automáticamente**: el único botón que lo hace es "Registrar gasto", igual que en el flujo manual.
6. Existen estados de error/fallback (recibo no legible, timeout, error de API), con la opción de reintentar o continuar manualmente.
7. La imagen capturada vive solo en memoria durante el flujo — no se guarda en `localStorage` ni en `sessionStorage`.

Arquitectura en producción:

```
Frontend
  ↓
/api/scan-receipt
  ↓
Netlify proxy (netlify.toml)
  ↓
Backend en Render
  ↓
OpenAI API
```

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el frontend en modo desarrollo (Vite) |
| `npm run server` | Levanta el backend (`server/index.js`) |
| `npm run lint` | Corre ESLint sobre el proyecto |
| `npm run build` | Genera el build de producción del frontend en `dist/` |
| `npm run preview` | Sirve localmente el build generado por `npm run build` |

## Persistencia

- **localStorage**: datos persistentes del producto — viajes, viaje activo y gastos. Sobreviven a recargar la página y a cerrar el navegador.
- **sessionStorage**: estado transitorio de la UI — drafts de formularios sin enviar (para no perderlos si el usuario recarga a mitad de completarlos) y flags de qué Drawer quedó abierto. Se limpia al cerrar la pestaña.

No hay base de datos ni backend de persistencia: todo el estado del producto vive en el navegador del usuario.

## Arquitectura de producción

### Frontend

**Netlify**
URL: [https://tripflowdiegofranco.netlify.app](https://tripflowdiegofranco.netlify.app)

### Backend

**Render**
URL: `https://tripflow-api.onrender.com`

El archivo `netlify.toml` define un rewrite/proxy: toda request a `/api/*` en el dominio de Netlify se reenvía (status 200, sin redirect visible en el navegador) hacia `https://tripflow-api.onrender.com/api/:splat`. Gracias a esto, el frontend sigue llamando siempre a la misma ruta relativa (`/api/scan-receipt`) tanto en desarrollo como en producción, sin necesidad de conocer la URL real del backend ni lidiar con CORS.

## Alcance y limitaciones

- Sin autenticación de usuarios
- Sin base de datos en la nube — persistencia local (localStorage) únicamente
- Sin viajes compartidos entre usuarios
- Sin pagos
- Sin conversión automática de monedas: seleccionar una moneda **no convierte los montos**, solo determina cómo se representan (símbolo/código) los valores de ese viaje

## Proceso de diseño

El desarrollo de Tripflow siguió este proceso:

```
Research → Synthesis → User Flows → Wireframes → Visual Design
→ Design System → Prototype → Development → QA → Deployment
```

La IA fue utilizada como herramienta de apoyo en distintas etapas del proceso. Las decisiones finales de producto, UX, UI y dirección visual fueron tomadas y validadas por el diseñador.

## Git y control de versiones

El desarrollo se gestionó mediante Git, manteniendo un historial de commits a lo largo de la evolución del producto.

Repositorio: [https://github.com/gofranco/Tripflow-app](https://github.com/gofranco/Tripflow-app)

## Figma

🔗 [https://www.figma.com/design/cm4DNabWIvFLtem5B6wXpV/Tripflow?node-id=11-7423](https://www.figma.com/design/cm4DNabWIvFLtem5B6wXpV/Tripflow?node-id=11-7423)

## Entregables

- **Aplicación publicada:** [https://tripflowdiegofranco.netlify.app](https://tripflowdiegofranco.netlify.app)
- **Repositorio GitHub:** [https://github.com/gofranco/Tripflow-app](https://github.com/gofranco/Tripflow-app)
- **Diseño/proceso en Figma:** [https://www.figma.com/design/cm4DNabWIvFLtem5B6wXpV/Tripflow?node-id=11-7423](https://www.figma.com/design/cm4DNabWIvFLtem5B6wXpV/Tripflow?node-id=11-7423)
