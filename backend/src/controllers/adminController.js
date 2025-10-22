import Usuario from '../models/Usuario.js';
import Cliente from '../models/Cliente.js';
import Caso from '../models/Caso.js';

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const crearUsuario = async (req, res) => {
    const { email, dni } = req.body;
    const existeUsuario = await Usuario.findOne({ $or: [{ email }, { dni }] });
    if (existeUsuario) {
        return res.status(400).json({ msg: "El email o DNI ya está registrado." });
    }

    try {
        const usuario = new Usuario(req.body);
        await usuario.save();
        res.status(201).json({ msg: "Usuario creado correctamente." });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const obtenerTodosLosClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find().populate('abogado', 'nombres apellidos');
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const obtenerTodosLosCasos = async (req, res) => {
    try {
        const casos = await Caso.find()
            .populate('abogadoAsignado', 'nombres apellidos')
            .populate('cliente', 'nombres apellidos');
        res.json(casos);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

export {
    obtenerUsuarios,
    crearUsuario,
    obtenerTodosLosClientes,
    obtenerTodosLosCasos
};