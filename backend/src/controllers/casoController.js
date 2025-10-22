import Caso from '../models/Caso.js';
import Cliente from '../models/Cliente.js';

const agregarCaso = async (req, res) => {
    const { clienteId } = req.body;

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
        return res.status(404).json({ msg: "Cliente no encontrado." });
    }

    if (cliente.abogado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: "Acción no autorizada." });
    }

    try {
        const caso = new Caso(req.body);
        caso.abogadoAsignado = req.usuario._id;
        caso.cliente = clienteId;
        const casoGuardado = await caso.save();
        res.json(casoGuardado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const obtenerCasos = async (req, res) => {
    try {
        const casos = await Caso.find()
            .where('abogadoAsignado').equals(req.usuario)
            .populate('cliente', 'nombres apellidos dni');
        res.json(casos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const obtenerCaso = async (req, res) => {
    const { id } = req.params;
    const caso = await Caso.findById(id).populate('cliente');

    if (!caso) {
        return res.status(404).json({ msg: "Caso no encontrado." });
    }

    if (caso.abogadoAsignado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: "Acción no autorizada." });
    }

    res.json(caso);
};

const actualizarCaso = async (req, res) => {
    const { id } = req.params;
    const caso = await Caso.findById(id);

    if (!caso) {
        return res.status(404).json({ msg: "Caso no encontrado." });
    }

    if (caso.abogadoAsignado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: "Acción no autorizada." });
    }

    caso.titulo = req.body.titulo || caso.titulo;
    caso.descripcion = req.body.descripcion || caso.descripcion;
    caso.estado = req.body.estado || caso.estado;

    try {
        const casoActualizado = await caso.save();
        res.json(casoActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const archivarCaso = async (req, res) => {
    const { id } = req.params;
    const caso = await Caso.findById(id);

    if (!caso || caso.abogadoAsignado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: "Acción no autorizada." });
    }

    try {
        caso.estado = 'archivado';
        await caso.save();
        res.json({ msg: "Caso archivado correctamente." });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const reactivarCaso = async(req, res) => {
    const { id } = req.params;
    const caso = await Caso.findById(id);

    if (!caso || caso.abogadoAsignado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: "Acción no autorizada." });
    }

    try {
        caso.estado = 'en_proceso';
        await caso.save();
        res.json({ msg: "Caso reactivado correctamente." });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
}

export {
    agregarCaso,
    obtenerCasos,
    obtenerCaso,
    actualizarCaso,
    archivarCaso,
    reactivarCaso
};