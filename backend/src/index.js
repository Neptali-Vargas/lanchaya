import express from 'express';
import cors from 'cors';

import salidasRouter from './routes/salidas.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares base
app.use(cors());
app.use(express.json());

// Ruta de salud (útil para verificar que el servidor está arriba)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, servicio: 'LanchaYa API' });
});

// Rutas de la API
app.use('/api', salidasRouter);

// 404 y manejo centralizado de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`LanchaYa API escuchando en http://localhost:${PORT}`);
});
