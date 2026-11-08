/**
 * Express 4 no captura las promesas rechazadas de los handlers async.
 * Este wrapper las envía al middleware de errores.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
