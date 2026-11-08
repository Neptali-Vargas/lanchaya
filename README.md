# LanchaYa Iquitos

Aplicación web full stack para consultar y administrar las salidas de lanchas, rápidos y deslizadores desde Iquitos, Loreto, Perú. Permite a las empresas fluviales registrar sus salidas programadas y a los pasajeros buscarlas y filtrarlas por destino, fecha y tipo de embarcación.

Este proyecto fue desarrollado como entrega de un curso de desarrollo full stack. Incluye una API REST en Node.js + Express y una interfaz de usuario en React + Vite.

---

## Integrante

- Neptali Vargas

---

## Tecnologías utilizadas

### Backend
- Node.js (entorno de ejecución)
- Express 4 (framework web)
- Archivo JSON como base de datos ligera (`backend/src/data/salidas.json`)
- CORS (habilita peticiones desde el frontend)
- Nodemon (reinicio automático en desarrollo)

### Frontend
- React 18 (librería de interfaces)
- Vite (bundler y servidor de desarrollo)
- CSS propio (estilos responsivos con colores sólidos)
- Fetch nativo (comunicación con la API)

---

## Estructura de carpetas

```
lanchaya/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── api.http
│   └── src/
│       ├── index.js                 # Inicia el servidor en el puerto 3000
│       ├── routes/
│       │   └── salidas.js           # Rutas de la API REST
│       ├── controllers/
│       │   └── salidas.controller.js# Lógica de cada endpoint
│       ├── middleware/
│       │   ├── asyncHandler.js      # Manejo de errores asíncronos
│       │   ├── errorHandler.js      # Middleware de errores global
│       │   └── validateSalida.js    # Validación de datos de entrada
│       └── data/
│           └── salidas.json         # Datos semilla (12 salidas de ejemplo)
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx                  # Componente principal
│   │   ├── constants.js             # Tipos de embarcación y utilidades
│   │   ├── index.css                # Estilos globales
│   │   ├── services/
│   │   │   └── api.js               # Funciones de fetch a la API
│   │   └── components/
│   │       ├── SalidaCard.jsx       # Tarjeta individual de salida
│   │       ├── Filtros.jsx          # Filtros por destino, fecha y tipo
│   │       ├── SalidaForm.jsx       # Formulario de crear/editar
│   │       └── Aviso.jsx            # Notificaciones flotantes
│   └── assets/
│       └── lancha.svg               # Logo vectorial de la lancha
├── .gitignore
└── README.md
```

---

## Cómo instalar y ejecutar el proyecto

Requisito previo: tener instalado **Node.js versión 20 o superior**.

### Paso 1: Clonar o descargar el proyecto

Si lo bajas desde GitHub:

```bash
git clone https://github.com/Neptali-Vargas/lanchaya.git
cd lanchaya
```

Si ya tienes la carpeta, entra directamente:

```bash
cd C:\Users\LENOVO\Desktop\lanchaya
```

### Paso 2: Ejecutar el backend (puerto 3000)

Abre una terminal en la carpeta `backend`:

```bash
cd backend
npm install
npm run dev
```

El servidor quedará escuchando en: `http://localhost:3000`

### Paso 3: Ejecutar el frontend (puerto 5173)

Abre una **segunda terminal** en la carpeta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

La aplicación se abrirá automáticamente en: `http://localhost:5173`

> Si usas otra dirección para el backend, crea un archivo `frontend/.env` con:
> `VITE_API_URL=http://tu-direccion:3000/api`

### Paso 4: Build de producción del frontend

```bash
cd frontend
npm run build
npm run preview
```

---

## Endpoints de la API

Todas las rutas están bajo el servidor backend (`http://localhost:3000`).

### Salidas

| Método | Ruta | Descripción | Parámetros |
|--------|------|-------------|------------|
| GET | `/api/salidas` | Lista todas las salidas ordenadas por fecha | `?destino=`, `?fecha=`, `?tipo=` |
| GET | `/api/salidas/:id` | Devuelve una salida por su ID | - |
| POST | `/api/salidas` | Crea una nueva salida | Cuerpo JSON |
| PUT | `/api/salidas/:id` | Actualiza una salida existente | Cuerpo JSON |
| DELETE | `/api/salidas/:id` | Elimina una salida | - |

### Destinos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/destinos` | Lista de destinos únicos disponibles |

---

## Ejemplos de uso

### Listar todas las salidas

```bash
curl http://localhost:3000/api/salidas
```

### Filtrar por destino y tipo

```bash
curl "http://localhost:3000/api/salidas?destino=Nauta&tipo=rapido"
```

### Ver destinos disponibles

```bash
curl http://localhost:3000/api/destinos
```

### Crear una salida (POST)

Cuerpo de la petición:

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

### Ejemplo de respuesta exitosa (POST)

```json
{
  "id": "abc123",
  "empresa": "Transportes Río Itaya",
  "embarcacion": "Don José II",
  "tipo": "rapido",
  "destino": "Nauta",
  "puerto": "Puerto Productores",
  "fechaHora": "2026-11-15T06:30",
  "duracionHoras": 2,
  "precio": 20,
  "cupos": 30,
  "creadoEn": "2026-11-08T10:00:00.000Z"
}
```

---

## Validaciones

### ¿Por qué existen las validaciones?

Las validaciones sirven para asegurar que los datos guardados sean correctos y coherentes. Evitan que se registren salidas con precios negativos, fechas ya pasadas, tipos de embarcación que no existen, o campos obligatorios vacíos. De esta forma, tanto el frontend como el archivo JSON de datos se mantienen limpios y la aplicación no se rompe por datos inválidos.

### Reglas de validación del backend

El backend responde con código **400** y un mensaje descriptivo cuando se cumple alguna de estas condiciones:

- `empresa`, `destino`, `puerto` o `fechaHora` están vacíos.
- `precio` no es un número mayor que 0.
- `tipo` no es uno de los valores permitidos: `lancha`, `rapido` o `deslizador`.
- `fechaHora` no es una fecha válida o es una fecha ya pasada (al momento de crear).
- `duracionHoras` no es mayor que 0.
- `cupos` no es un número entero mayor o igual a 0.

### Validaciones del frontend

Antes de enviar los datos al servidor, el frontend valida los mismos campos y muestra el error debajo de cada campo correspondiente, para que el usuario sepa exactamente qué corregir sin tener que recargar la página.

---

## Funcionalidades principales

1. **Listado de salidas:** Muestra todas las salidas registradas ordenadas por la más próxima primero.
2. **Filtros:** Permite filtrar por destino, fecha de salida y tipo de embarcación. Incluye botón para limpiar todos los filtros.
3. **Registro de salidas:** Formulario para crear una nueva salida con validación en tiempo real.
4. **Edición de salidas:** Permite modificar los datos de una salida existente.
5. **Eliminación:** Permite borrar una salida con confirmación previa.
6. **Estados de la interfaz:** Pantallas de carga, lista vacía, error de conexión con botón de reintento.
7. **Diseño responsivo:** La interfaz se adapta correctamente a celulares, tablets y computadoras de escritorio.
8. **Indicador de cupos:** Cada tarjeta muestra la disponibilidad de cupos con color: verde (disponibles), amarillo (pocos cupos), rojo (casi lleno).
9. **Notificaciones:** Avisos flotantes al crear, editar o eliminar salidas correctamente.

---

## Cómo probar la API

Puedes usar cualquiera de estas herramientas:

- **curl** (terminal):

```bash
curl http://localhost:3000/api/salidas
curl "http://localhost:3000/api/salidas?destino=Nauta&tipo=rapido"
curl http://localhost:3000/api/destinos
```

- **Postman**, **Insomnia** o **Thunder Client**: importa los endpoints y envía peticiones GET, POST, PUT y DELETE a `http://localhost:3000`.

---

## Despliegue local

Una vez que ambos servidores estén corriendo:

- **Frontend (interfaz web):** http://localhost:5173
- **Backend (API REST):** http://localhost:3000

Abre el frontend en tu navegador para usar la aplicación completa.

---

## Archivos ignorados por Git

El archivo `.gitignore` evita que se suban a GitHub:

- `node_modules/` (dependencias instaladas localmente)
- `dist/` (build de producción del frontend)
- `.env` y `.env.local` (variables de entorno sensibles)
- `*.local`
- `.DS_Store` (archivos de macOS)
- `.vscode/` (configuración del editor)

---

Desarrollado por **Neptali Vargas**