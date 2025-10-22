import express from 'express';
import { obtenerDocumentosPorCaso, agregarDocumento } from '../controllers/documentoController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(checkAuth);

router.route('/:casoId')
    .post(agregarDocumento)
    .get(obtenerDocumentosPorCaso);

export default router;