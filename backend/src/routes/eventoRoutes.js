import express from 'express';
import { obtenerEventosPorCaso, agregarEvento } from '../controllers/eventoController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(checkAuth);

router.route('/:casoId')
    .get(obtenerEventosPorCaso)
    .post(agregarEvento);

export default router;