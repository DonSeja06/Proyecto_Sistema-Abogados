import Pago from '../models/Pago.js';

const obtenerPagosPorCaso = async (req, res) => {
    const { casoId } = req.params;
    const pagos = await Pago.find({ caso: casoId }).sort({ fecha_pago: -1 });
    res.json(pagos);
};

const registrarPago = async (req, res) => {
    const pago = new Pago(req.body);
    pago.caso = req.params.casoId;
    pago.abogadoReceptor = req.usuario._id;

    try {
        const pagoGuardado = await pago.save();
        res.status(201).json(pagoGuardado);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

export { obtenerPagosPorCaso, registrarPago };