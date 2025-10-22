import express from 'express';
import {
    registrar,
    autenticar, perfil, obtenerAbogados,
    obtenerEstadisticas, obtenerHonorariosDetallados
} from '../controllers/usuarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registrar', registrar);

router.post('/login', autenticar);

router.get('/perfil', checkAuth, perfil);

router.get('/abogados', checkAuth, obtenerAbogados);

router.get('/estadisticas', checkAuth, obtenerEstadisticas);

router.get('/honorarios-detallados', checkAuth, obtenerHonorariosDetallados);

export default router;