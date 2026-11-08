# LanchaYa Iquitos

Sistema para consultar y administrar salidas de lanchas, rápidos y deslizadores desde Iquitos. Las empresas fluviales registran sus salidas y los pasajeros las filtran por destino, fecha y tipo de embarcación.

## Uso

La aplicación permite:

- Ver el listado de salidas ordenado por fecha más próxima.
- Filtrar salidas por destino, fecha y tipo de embarcación.
- Registrar nuevas salidas mediante un formulario.
- Editar y eliminar salidas existentes.
- Ver la disponibilidad de cupos con indicador de color.

## Tecnologías

- Backend: Node.js + Express 4 (archivo JSON)
- Frontend: React 18 + Vite
- Estilos: CSS propio, responsive

## Ejecución

Requisito: Node.js 20 o superior.

Backend (puerto 3000):

```bash
cd backend
npm install
npm run dev
```

Frontend (puerto 5173, en otra terminal):

```bash
cd frontend
npm install
npm run dev
```

Luego abre http://localhost:5173 en el navegador.

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/salidas | Lista salidas |
| GET | /api/salidas/:id | Detalle de una salida |
| POST | /api/salidas | Registra una salida |
| PUT | /api/salidas/:id | Actualiza una salida |
| DELETE | /api/salidas/:id | Elimina una salida |
| GET | /api/destinos | Lista de destinos |

## Validaciones

El backend responde error 400 cuando faltan campos obligatorios, el precio no es mayor a 0, el tipo no es válido (lancha, rapido o deslizador), la fecha está en el pasado, o los cupos/duración no son válidos.

## Integrante

Neptali Vargas