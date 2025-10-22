import express from 'express';
import {
    agregarCliente,
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    desactivarCliente,
    delegarCliente,
    reactivarCliente
} from '../controllers/clienteController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(checkAuth);

router.route('/')
    .post(agregarCliente)
    .get(obtenerClientes);

router.route('/:id')
    .get(obtenerCliente)
    .put(actualizarCliente);
        
router.put('/desactivar/:id', desactivarCliente);

router.put('/delegar/:id', delegarCliente);

router.put('/reactivar/:id', reactivarCliente);

export default router;