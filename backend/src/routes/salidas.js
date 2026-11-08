import { Router } from 'express';

import { asyncHandler } from '../middleware/asyncHandler.js';
import * as salidasController from '../controllers/salidas.controller.js';

const router = Router();

// Destinos sin repetir (debe ir antes que /salidas/:id por claridad de rutas)
router.get('/destinos', asyncHandler(salidasController.listarDestinos));

// CRUD de salidas
router.get('/salidas', asyncHandler(salidasController.listarSalidas));
router.get('/salidas/:id', asyncHandler(salidasController.obtenerSalida));
router.post('/salidas', asyncHandler(salidasController.crearSalida));
router.put('/salidas/:id', asyncHandler(salidasController.actualizarSalida));
router.delete('/salidas/:id', asyncHandler(salidasController.eliminarSalida));

export default router;
