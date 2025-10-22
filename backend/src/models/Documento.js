import mongoose from 'mongoose';

const documentoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    rutaArchivo: {
        type: String,
        required: true
    },
    caso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caso',
        required: true
    },
    subidoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true
});

const Documento = mongoose.model('Documento', documentoSchema);
export default Documento;