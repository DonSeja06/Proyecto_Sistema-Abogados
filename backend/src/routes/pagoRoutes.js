import express from 'express';
import { obtenerPagosPorCaso, registrarPago } from '../controllers/pagoController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(checkAuth);

router.route('/:casoId')
    .get(obtenerPagosPorCaso)
    .post(registrarPago);

export default router;