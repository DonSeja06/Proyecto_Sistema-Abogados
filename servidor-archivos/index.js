import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './src/routes/uploadRoutes.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api', (req, res) => {
    res.json({ msg: 'Servidor de archivos funcionando' });
});

app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor de archivos corriendo en el puerto ${PORT}`);
});