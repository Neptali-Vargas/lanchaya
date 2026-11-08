const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
  /\/$/,
  ''
);

async function request(path, options = {}) {
  const { headers, ...resto } = options;

  let respuesta;
  try {
    respuesta = await fetch(`${BASE_URL}${path}`, {
      ...resto,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000'
    );
  }

  if (respuesta.status === 204) return null;

  const texto = await respuesta.text();
  let datos = null;
  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const error = new Error(datos?.error || `Error ${respuesta.status} al llamar la API`);
    error.status = respuesta.status;
    error.errores = datos?.errores || [];
    throw error;
  }

  return datos;
}

export const api = {
  getSalidas(filtros = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
        params.set(clave, valor);
      }
    });
    const query = params.toString();
    return request(`/salidas${query ? `?${query}` : ''}`);
  },

  getDestinos() {
    return request('/destinos');
  },

  crearSalida(datos) {
    return request('/salidas', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  actualizarSalida(id, datos) {
    return request(`/salidas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
  },

  eliminarSalida(id) {
    return request(`/salidas/${id}`, { method: 'DELETE' });
  },
};

export { BASE_URL };
