import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    tipo_evento: {
        type: String,
        enum: ['audiencia', 'reunion', 'presentacion_documentos', 'otro'],
        default: 'otro'
    },
    fecha_evento: {
        type: Date,
        required: true
    },
    caso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caso',
        required: true
    }
}, {
    timestamps: true
});

const Evento = mongoose.model('Evento', eventoSchema);
export default Evento;