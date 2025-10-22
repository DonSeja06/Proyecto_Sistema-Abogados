import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import conectarDB from './src/config/database.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import clienteRoutes from './src/routes/clienteRoutes.js';
import casoRoutes from './src/routes/casoRoutes.js';
import documentoRoutes from './src/routes/documentoRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import eventoRoutes from './src/routes/eventoRoutes.js';
import pagoRoutes from './src/routes/pagoRoutes.js';

const app = express();
dotenv.config();
conectarDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/casos', casoRoutes);
app.use('/api/documentos', documentoRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/eventos', eventoRoutes);
app.use('/api/pagos', pagoRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor principal corriendo en el puerto ${PORT}`);
});