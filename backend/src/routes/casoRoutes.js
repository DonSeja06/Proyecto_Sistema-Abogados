import express from 'express';
import {
    agregarCaso,
    obtenerCasos,
    obtenerCaso,
    actualizarCaso,
    archivarCaso,
    reactivarCaso
} from '../controllers/casoController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(checkAuth);

router.route('/')
    .post(agregarCaso)
    .get(obtenerCasos);

router.route('/:id')
    .get(obtenerCaso)
    .put(actualizarCaso);
    
router.put('/archivar/:id', archivarCaso);

router.put('/reactivar/:id', reactivarCaso);

export default router;