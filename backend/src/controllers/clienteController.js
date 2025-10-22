import Cliente from '../models/Cliente.js';
import Caso from '../models/Caso.js'

const agregarCliente = async (req, res) => {
    const cliente = new Cliente(req.body);
    cliente.abogado = req.usuario._id; 
    try {
        const clienteGuardado = await cliente.save();
        res.json(clienteGuardado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find().where('abogado').equals(req.usuario);
        res.json(clientes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const obtenerCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado.' });
    }

    if (cliente.abogado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: 'Acción no autorizada.' });
    }

    res.json(cliente);
};

const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado.' });
    }

    if (cliente.abogado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: 'Acción no autorizada.' });
    }

    cliente.nombres = req.body.nombres || cliente.nombres;
    cliente.apellidos = req.body.apellidos || cliente.apellidos;
    cliente.dni = req.body.dni || cliente.dni;
    cliente.ruc = req.body.ruc || cliente.ruc;
    cliente.direccion = req.body.direccion || cliente.direccion;
    cliente.email = req.body.email || cliente.email;
    cliente.telefono = req.body.telefono || cliente.telefono;

    try {
        const clienteActualizado = await cliente.save();
        res.json(clienteActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const desactivarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado.' });
    }

    if (cliente.abogado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: 'Acción no autorizada.' });
    }

    try {
        cliente.estado = false;
        await cliente.save();
        res.json({ msg: 'Cliente desactivado correctamente.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const delegarCliente = async (req, res) => {
    const { id } = req.params;
    const { nuevoAbogadoId } = req.body;

    try {
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado." });
        }

        if (cliente.abogado.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ msg: "Acción no autorizada." });
        }

        cliente.abogado = nuevoAbogadoId;
        await cliente.save();

        await Caso.updateMany(
            { cliente: id },
            { abogadoAsignado: nuevoAbogadoId }
        );

        res.json({ msg: "Cliente y casos asociados han sido delegados correctamente." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

const reactivarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente || cliente.abogado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: 'Acción no autorizada.' });
    }

    try {
        cliente.estado = true;
        await cliente.save();
        res.json({ msg: 'Cliente reactivado correctamente.' });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

export {
    agregarCliente,
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    desactivarCliente,
    delegarCliente,
    reactivarCliente
};