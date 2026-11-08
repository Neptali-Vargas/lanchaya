export function notFound(req, res) {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('[LanchaYa API]', err);

  const status = err.status || 500;
  const respuesta = { error: err.message || 'Error interno del servidor' };

  if (Array.isArray(err.errores) && err.errores.length > 0) {
    respuesta.errores = err.errores;
  }

  res.status(status).json(respuesta);
}
