export const TIPOS = ['lancha', 'rapido', 'deslizador'];

export const CAMPOS_OBLIGATORIOS = ['empresa', 'destino', 'puerto', 'fechaHora'];

/** Convierte una fecha a "YYYY-MM-DDTHH:mm" en hora local. */
function normalizarFechaHora(valor) {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;

  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}` +
    `T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`
  );
}

function textoObligatorio(body, campo, errores, datos) {
  const valor = body[campo];

  if (valor === undefined || valor === null || String(valor).trim() === '') {
    errores.push(`El campo "${campo}" es obligatorio.`);
    return;
  }
  if (typeof valor !== 'string') {
    errores.push(`El campo "${campo}" debe ser texto.`);
    return;
  }
  datos[campo] = valor.trim();
}

function textoOpcional(body, campo, errores, datos) {
  const valor = body[campo];
  if (valor === undefined || valor === null) return;

  if (typeof valor !== 'string') {
    errores.push(`El campo "${campo}" debe ser texto.`);
    return;
  }
  datos[campo] = valor.trim();
}

/**
 * Valida y normaliza el cuerpo de una salida.
 * Devuelve { errores, datos }.
 */
export function validarSalida(body = {}, { esCreacion = true } = {}) {
  const errores = [];
  const datos = {};

  // Textos
  textoObligatorio(body, 'empresa', errores, datos);
  textoObligatorio(body, 'destino', errores, datos);
  textoObligatorio(body, 'puerto', errores, datos);
  textoOpcional(body, 'embarcacion', errores, datos);

  // fechaHora
  if (
    body.fechaHora === undefined ||
    body.fechaHora === null ||
    String(body.fechaHora).trim() === ''
  ) {
    errores.push('El campo "fechaHora" es obligatorio.');
  } else {
    const fecha = new Date(body.fechaHora);
    if (Number.isNaN(fecha.getTime())) {
      errores.push(
        '"fechaHora" debe ser una fecha válida en formato ISO 8601 (ej. 2026-11-09T06:30).'
      );
    } else {
      if (esCreacion && fecha.getTime() < Date.now()) {
        errores.push('"fechaHora" no puede estar en el pasado.');
      }
      datos.fechaHora = normalizarFechaHora(body.fechaHora);
    }
  }

  // tipo
  if (!TIPOS.includes(body.tipo)) {
    errores.push(`"tipo" solo acepta: ${TIPOS.join(', ')}.`);
  } else {
    datos.tipo = body.tipo;
  }

  // precio
  const precio = Number(body.precio);
  if (body.precio === undefined || body.precio === null || body.precio === '') {
    errores.push('El campo "precio" es obligatorio.');
  } else if (!Number.isFinite(precio) || precio <= 0) {
    errores.push('"precio" debe ser un número mayor que 0.');
  } else {
    datos.precio = precio;
  }

  // duracionHoras (opcional, pero si viene debe ser > 0)
  if (body.duracionHoras !== undefined && body.duracionHoras !== null && body.duracionHoras !== '') {
    const duracion = Number(body.duracionHoras);
    if (!Number.isFinite(duracion) || duracion <= 0) {
      errores.push('"duracionHoras" debe ser un número mayor que 0.');
    } else {
      datos.duracionHoras = duracion;
    }
  }

  // cupos (opcional, entero >= 0)
  if (body.cupos !== undefined && body.cupos !== null && body.cupos !== '') {
    const cupos = Number(body.cupos);
    if (!Number.isInteger(cupos) || cupos < 0) {
      errores.push('"cupos" debe ser un número entero mayor o igual a 0.');
    } else {
      datos.cupos = cupos;
    }
  }

  return { errores, datos };
}
