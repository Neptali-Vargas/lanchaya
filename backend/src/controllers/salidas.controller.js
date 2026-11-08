import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validarSalida, TIPOS } from '../middleware/validateSalida.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'salidas.json');

// Cola simple para evitar escrituras concurrentes sobre el JSON
let cola = Promise.resolve();
function conBloqueo(tarea) {
  const resultado = cola.then(tarea, tarea);
  cola = resultado.catch(() => {});
  return resultado;
}

async function leerSalidas() {
  const contenido = await readFile(DATA_FILE, 'utf-8');
  const datos = JSON.parse(contenido);

  if (!Array.isArray(datos)) {
    const error = new Error('El archivo de datos no contiene un arreglo de salidas.');
    error.status = 500;
    throw error;
  }
  return datos;
}

async function guardarSalidas(salidas) {
  await writeFile(DATA_FILE, `${JSON.stringify(salidas, null, 2)}\n`, 'utf-8');
}

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function ordenarPorFecha(salidas) {
  return [...salidas].sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
}

function coincideFiltros(salida, { destino, fecha, tipo }) {
  if (destino && salida.destino.toLowerCase() !== String(destino).trim().toLowerCase()) {
    return false;
  }
  if (tipo && salida.tipo !== tipo) {
    return false;
  }
  if (fecha && !String(salida.fechaHora).startsWith(String(fecha))) {
    return false;
  }
  return true;
}

// GET /api/salidas?destino=&fecha=&tipo=
export async function listarSalidas(req, res) {
  const salidas = await leerSalidas();
  const filtradas = salidas.filter((salida) => coincideFiltros(salida, req.query));

  res.status(200).json(ordenarPorFecha(filtradas));
}

// GET /api/salidas/:id
export async function obtenerSalida(req, res) {
  const id = Number(req.params.id);
  const salidas = await leerSalidas();
  const salida = salidas.find((item) => item.id === id);

  if (!salida) {
    throw errorHttp(404, `No existe una salida con id ${req.params.id}.`);
  }

  res.status(200).json(salida);
}

// POST /api/salidas
export async function crearSalida(req, res) {
  const { errores, datos } = validarSalida(req.body, { esCreacion: true });

  if (errores.length > 0) {
    return res.status(400).json({ error: errores[0], errores });
  }

  const creada = await conBloqueo(async () => {
    const salidas = await leerSalidas();
    const siguienteId = salidas.reduce((max, item) => Math.max(max, item.id), 0) + 1;

    const nueva = {
      id: siguienteId,
      empresa: datos.empresa,
      embarcacion: datos.embarcacion || '',
      tipo: datos.tipo,
      destino: datos.destino,
      puerto: datos.puerto,
      fechaHora: datos.fechaHora,
      duracionHoras: datos.duracionHoras ?? null,
      precio: datos.precio,
      cupos: datos.cupos ?? 0,
    };

    salidas.push(nueva);
    await guardarSalidas(salidas);
    return nueva;
  });

  res.status(201).json(creada);
}

// PUT /api/salidas/:id
export async function actualizarSalida(req, res) {
  const id = Number(req.params.id);

  const { errores, datos } = validarSalida(req.body, { esCreacion: false });
  if (errores.length > 0) {
    return res.status(400).json({ error: errores[0], errores });
  }

  const actualizada = await conBloqueo(async () => {
    const salidas = await leerSalidas();
    const indice = salidas.findIndex((item) => item.id === id);

    if (indice === -1) {
      throw errorHttp(404, `No existe una salida con id ${req.params.id}.`);
    }

    const salida = salidas[indice];
    const actualizada = {
      ...salida,
      empresa: datos.empresa,
      embarcacion: datos.embarcacion ?? salida.embarcacion ?? '',
      tipo: datos.tipo,
      destino: datos.destino,
      puerto: datos.puerto,
      fechaHora: datos.fechaHora,
      duracionHoras: datos.duracionHoras ?? salida.duracionHoras ?? null,
      precio: datos.precio,
      cupos: datos.cupos ?? salida.cupos ?? 0,
    };

    salidas[indice] = actualizada;
    await guardarSalidas(salidas);
    return actualizada;
  });

  res.status(200).json(actualizada);
}

// DELETE /api/salidas/:id
export async function eliminarSalida(req, res) {
  const id = Number(req.params.id);

  await conBloqueo(async () => {
    const salidas = await leerSalidas();
    const existe = salidas.some((item) => item.id === id);

    if (!existe) {
      throw errorHttp(404, `No existe una salida con id ${req.params.id}.`);
    }

    await guardarSalidas(salidas.filter((item) => item.id !== id));
  });

  res.status(204).send();
}

// GET /api/destinos
export async function listarDestinos(req, res) {
  const salidas = await leerSalidas();
  const destinos = [...new Set(salidas.map((salida) => salida.destino))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'es'));

  res.status(200).json(destinos);
}

// Exportado por si se necesita en pruebas
export { TIPOS };
