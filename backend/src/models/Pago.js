import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
    monto: {
        type: Number,
        required: true
    },
    metodo_pago: {
        type: String,
        enum: ['efectivo', 'transferencia', 'tarjeta'],
        default: 'efectivo'
    },
    fecha_pago: {
        type: Date,
        default: Date.now
    },
    descripcion: {
        type: String,
        trim: true
    },
    caso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caso',
        required: true
    },
    abogadoReceptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true
});

const Pago = mongoose.model('Pago', pagoSchema);
export default Pago;