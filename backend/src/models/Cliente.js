import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    dni: {
        type: String,
        trim: true
    },
    ruc: {
        type: String,
        trim: true
    },
    direccion: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    abogado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Cliente = mongoose.model('Cliente', clienteSchema);
export default Cliente;