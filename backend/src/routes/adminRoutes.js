import express from 'express';
import { obtenerUsuarios, crearUsuario } from '../controllers/adminController.js';
import checkAuth from '../middleware/authMiddleware.js';
import esAdmin from '../middleware/adminMiddleware.js';
import { obtenerTodosLosClientes } from '../controllers/adminController.js';
import { obtenerTodosLosCasos } from '../controllers/adminController.js';

const router = express.Router();

router.use(checkAuth, esAdmin); 

router.route('/usuarios')
    .get(obtenerUsuarios)
    .post(crearUsuario);

router.get('/clientes', obtenerTodosLosClientes);

router.get('/casos', obtenerTodosLosCasos);

export default router;