import Usuario from '../models/Usuario.js';
import generarJWT from '../helpers/generarJWT.js';
import bcrypt from 'bcrypt';
import Caso from '../models/Caso.js';
import Cliente from '../models/Cliente.js';
import Evento from '../models/Evento.js';
import Pago from '../models/Pago.js';

const registrar = async (req, res) => {
    const { email, dni } = req.body;

    try {
        const existeUsuario = await Usuario.findOne({ $or: [{ email }, { dni }] });

        if (existeUsuario) {
            const error = new Error('Usuario ya registrado con ese email o DNI.');
            return res.status(400).json({ msg: error.message });
        }

        const usuario = new Usuario(req.body);
        const usuarioGuardado = await usuario.save();

        res.status(201).json({ msg: 'Usuario registrado correctamente. Por favor, inicia sesión.' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            const error = new Error('El usuario no existe.');
            return res.status(404).json({ msg: error.message });
        }

        if (!usuario.estado) {
            const error = new Error('Tu cuenta ha sido desactivada.');
            return res.status(403).json({ msg: error.message });
        }

        if (await bcrypt.compare(password, usuario.password)) {
            res.json({
                _id: usuario._id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol: usuario.rol,
                token: generarJWT(usuario._id),
            });
        } else {
            const error = new Error('La contraseña es incorrecta.');
            return res.status(401).json({ msg: error.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const perfil = (req, res) => {
    const { usuario } = req;
    res.json(usuario);
};

const obtenerAbogados = async (req, res) => {
    try {
        const abogados = await Usuario.find({ rol: 'abogado', estado: true }).select('-password -__v');
        res.json(abogados);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const obtenerEstadisticas = async (req, res) => {
    try {
        const casosActivos = await Caso.countDocuments({
            abogadoAsignado: req.usuario._id,
            estado: 'en_proceso'
        });

        const clientesActivos = await Cliente.countDocuments({
            abogado: req.usuario._id,
            estado: { $ne: false }
        });

        const pagosRecibidos = await Pago.find({ abogadoReceptor: req.usuario._id });
        const totalHonorarios = pagosRecibidos.reduce((total, pago) => total + pago.monto, 0);

        const proximosEventos = await Evento.find({
            caso: { $in: await Caso.find({ abogadoAsignado: req.usuario._id }).select('_id') },
            fecha_evento: { $gte: new Date() }
        })
            .sort({ fecha_evento: 1 })
            .limit(3)
            .populate({
                path: 'caso',
                select: 'titulo',
                populate: {
                    path: 'cliente',
                    select: 'nombres apellidos'
                }
            });

        res.json({
            casosActivos,
            clientesActivos,
            totalHonorarios,
            proximosEventos
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error al obtener las estadísticas." });
    }
};

const obtenerHonorariosDetallados = async (req, res) => {
    try {
        const historialPagos = await Pago.find({ abogadoReceptor: req.usuario._id })
            .populate('caso', 'titulo')
            .sort({ fecha_pago: -1 });

        const datosGrafico = await Pago.aggregate([
            { $match: { abogadoReceptor: req.usuario._id } },
            {
                $group: {
                    _id: { anio: { $year: "$fecha_pago" }, mes: { $month: "$fecha_pago" } },
                    totalMes: { $sum: "$monto" }
                }
            },
            { $sort: { "_id.anio": 1, "_id.mes": 1 } }
        ]);

        res.json({ historialPagos, datosGrafico });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error al obtener los honorarios." });
    }
};

export {
    registrar,
    autenticar,
    perfil,
    obtenerAbogados,
    obtenerEstadisticas,
    obtenerHonorariosDetallados
};