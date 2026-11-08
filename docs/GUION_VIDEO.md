# Guion del video — LanchaYa Iquitos (2 a 3 minutos)

> Objetivo: demostrar el CRUD completo y los filtros funcionando.
> Antes de grabar: backend y frontend corriendo, navegador en http://localhost:5173
> y VSCode con `backend/api.http` abierto.

## Preparación (antes de grabar)

1. `cd backend && npm run dev`
2. `cd frontend && npm run dev`
3. Abrir http://localhost:5173
4. Tener VSCode con `backend/api.http` listo (para el minuto 2:10)
5. Cerrar pestañas y notificaciones que no se usen

## Guion

### 0:00 – 0:20 | Presentación
- Di tu nombre y el nombre del proyecto.
- Explica el problema en una frase: "En Iquitos no hay un lugar único para saber qué
  lanchas salen, a qué hora y cuánto cuestan."

### 0:20 – 0:40 | Listado
- Muestra la pantalla principal.
- Señala que las tarjetas muestran empresa, destino, puerto, fecha/hora, precio y tipo.
- Menciona que están ordenadas por la salida más próxima.
- Muestra el contador de salidas (12).

### 0:40 – 1:10 | Filtros
- En **Destino** elige `Nauta` → se filtran las tarjetas.
- En **Tipo** elige `Rápido` → se combinan los filtros.
- Elige una **fecha** y muestra el resultado.
- Presiona **Limpiar filtros** → vuelven las 12 salidas.
- Menciona que el select de destinos se llena desde `GET /api/destinos`.

### 1:10 – 1:45 | Registrar (con validación)
- Clic en **Registrar salida**.
- Presiona **Registrar salida** con el formulario vacío → muestra los errores en rojo.
- Llena los campos:
  - Empresa: `Prueba Video`
  - Embarcación: `Demo I`
  - Destino: `Nauta`
  - Puerto: `Puerto Productores`
  - Tipo: `Rápido`
  - Fecha y hora: una fecha futura
  - Precio: `35`, Duración: `2`, Cupos: `20`
- Guarda → aparece el aviso de éxito y la nueva tarjeta.

### 1:45 – 2:05 | Editar
- En la tarjeta nueva, clic en **Editar**.
- Cambia el precio a `40` y los cupos a `5`.
- Guarda → muestra el aviso y el precio actualizado.
- Señala el color del indicador de cupos (rojo con 5).

### 2:05 – 2:20 | Eliminar
- Clic en **Eliminar** en la tarjeta nueva.
- Muestra el diálogo de confirmación y acepta.
- El listado vuelve a 12 tarjetas.

### 2:20 – 2:45 | API en VSCode
- Cambia a VSCode, archivo `backend/api.http`.
- Clic en **Send Request** sobre `GET {{host}}/salidas` → muestra el JSON.
- Clic en `GET {{host}}/destinos` → muestra los destinos.
- Clic en el caso **Falta empresa** → muestra el `400` con el mensaje de validación.

### 2:45 – 3:00 | Cierre
- Muestra la app en tamaño celular (F12 → modo dispositivo) para demostrar el responsive.
- Cierra diciendo: "Backend en Express con validaciones, frontend en React con filtros y
  CRUD completo, persistencia en JSON."

## Consejos
- Habla claro y sin apurarte; no hace falta mostrar cada clic dos veces.
- Graba en 1080p si puedes.
- Si algo falla, no cortes: corrige y sigue (demuestra que funciona de verdad).
- Duración ideal: **2 min 30 s**.

## Checklist de entrega
- [ ] Repositorio GitHub público con `backend/` y `frontend/`
- [ ] README con integrantes, `npm install` y `npm run dev`
- [ ] Video de 2–3 minutos
- [ ] ZIP sin `node_modules`: `S#_ProyectoFullStack_Apellidos`
- [ ] Probar una última vez: `GET /api/salidas`, filtros, registrar, editar y eliminar
