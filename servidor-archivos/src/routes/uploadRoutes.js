import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('archivo'), (req, res) => {
    if (req.file) {
        res.json({ 
            msg: 'Archivo subido correctamente',
            url: `/uploads/${req.file.filename}` 
        });
    } else {
        res.status(400).json({ msg: 'Error al subir el archivo o no se proporcionó un archivo' });
    }
});

export default router;