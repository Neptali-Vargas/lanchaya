export const TIPOS = ['lancha', 'rapido', 'deslizador'];

export const TIPO_INFO = {
  lancha: { etiqueta: 'Lancha' },
  rapido: { etiqueta: 'Rápido' },
  deslizador: { etiqueta: 'Deslizador' },
};

/** Formatea "2026-11-09T06:30" como "lun, 09 nov, 06:30". */
export function formatearFechaHora(valor) {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return String(valor ?? '');

  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(fecha);
}

/** Devuelve la fecha y hora local actual en formato para <input type="datetime-local">. */
export function ahoraLocalISO() {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
  return fecha.toISOString().slice(0, 16);
}

/** Nivel de cupos para colorear el indicador (verde / amarillo / rojo). */
export function nivelCupos(cupos) {
  const total = Number(cupos) || 0;
  if (total <= 5) return 'bajo';
  if (total <= 20) return 'medio';
  return 'alto';
}
