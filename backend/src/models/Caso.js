import mongoose from 'mongoose';

const casoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    estado: {
        type: String,
        enum: ['en_proceso', 'cerrado', 'archivado'],
        default: 'en_proceso'
    },
    fecha_inicio: {
        type: Date,
        default: Date.now()
    },
    abogadoAsignado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    }
}, {
    timestamps: true
});

const Caso = mongoose.model('Caso', casoSchema);
export default Caso;