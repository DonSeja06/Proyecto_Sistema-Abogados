import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    especialidad: {
        type: String,
        trim: true
    },
    rol: {
        type: String,
        required: true,
        enum: ['admin', 'abogado'],
        default: 'abogado'
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;