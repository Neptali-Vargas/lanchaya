# LanchaYa Iquitos 🚤

Sistema web full stack para consultar y administrar las salidas de lanchas, rápidos y deslizadores desde Iquitos. Permite a las empresas fluviales registrar sus salidas y a los pasajeros filtrarlas por destino, fecha y tipo de embarcación.

## Integrante

- Neptali Vargas

## Tecnologías

| Capa | Tecnología |
| --- | --- |
| Backend | Node.js + Express 4 |
| Base de datos | Archivo JSON (`backend/src/data/salidas.json`) |
| Frontend | React 18 + Vite |
| HTTP | `fetch` nativo |
| Estilos | CSS propio (responsive) |

## Cómo ejecutar el proyecto

Requisitos: **Node.js 20 o superior**.

### 1. Backend (puerto 3000)

```bash
cd backend
npm install
npm run dev
```

La API quedará disponible en: `http://localhost:3000`

### 2. Frontend (puerto 5173) — en otra terminal

```bash
cd frontend
npm install
npm run dev
```

La aplicación se abre en: `http://localhost:5173`

> Si la API corre en otra URL, crea `frontend/.env` con:
> `VITE_API_URL=http://tu-host:3000/api`

### Build de producción del frontend

```bash
cd frontend
npm run build
npm run preview
```

## Endpoints de la API

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/salidas` | Lista todas las salidas (filtra por `?destino=`, `?fecha=`, `?tipo=`) |
| GET | `/api/salidas/:id` | Detalle de una salida |
| POST | `/api/salidas` | Registra una nueva salida |
| PUT | `/api/salidas/:id` | Actualiza una salida existente |
| DELETE | `/api/salidas/:id` | Elimina una salida |
| GET | `/api/destinos` | Lista de destinos disponibles |

Ejemplo de cuerpo para `POST` / `PUT`:

```json
{
  "empresa": "Transportes Río Itaya",
  "embarcacion": "Don José II",
  "tipo": "rapido",
  "destino": "Nauta",
  "puerto": "Puerto Productores",
  "fechaHora": "2026-11-15T06:30",
  "duracionHoras": 2,
  "precio": 20,
  "cupos": 30
}
```

## Validaciones

El backend responde con error **400** cuando:

- `empresa`, `destino`, `puerto` o `fechaHora` están vacíos.
- `precio` no es mayor que 0.
- `tipo` no es `lancha`, `rapido` o `deslizador`.
- `fechaHora` no es válida o está en el pasado.
- `duracionHoras` no es mayor que 0.
- `cupos` no es un número entero mayor o igual a 0.

El frontend valida los mismos campos antes de enviar.

## Funcionalidades

- Listado de salidas ordenado por la más próxima.
- Filtros por destino, fecha y tipo de embarcación.
- Registro, edición y eliminación de salidas.
- Estados de carga, lista vacía y error con botón de reintento.
- Diseño responsive (funciona en celular).
- Indicador de cupos con color (verde, amarillo, rojo).

## Pruebas de la API

```bash
curl http://localhost:3000/api/salidas
curl "http://localhost:3000/api/salidas?destino=Nauta&tipo=rapido"
curl http://localhost:3000/api/destinos
```
