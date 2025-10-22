import Evento from '../models/Evento.js';

const obtenerEventosPorCaso = async (req, res) => {
    const { casoId } = req.params;
    const eventos = await Evento.find({ caso: casoId }).sort({ fecha_evento: -1 });
    res.json(eventos);
};

const agregarEvento = async (req, res) => {
    const evento = new Evento(req.body);
    evento.caso = req.params.casoId;
    try {
        const eventoGuardado = await evento.save();
        res.status(201).json(eventoGuardado);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor." });
    }
};

export { obtenerEventosPorCaso, agregarEvento };