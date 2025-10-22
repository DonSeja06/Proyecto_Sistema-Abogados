import Documento from '../models/Documento.js';
import Caso from '../models/Caso.js';

const obtenerDocumentosPorCaso = async (req, res) => {
    const { casoId } = req.params;
    try {
        const documentos = await Documento.find({ caso: casoId });
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const agregarDocumento = async (req, res) => {
    const { casoId } = req.params;
    
    const caso = await Caso.findById(casoId);
    if (!caso || caso.abogadoAsignado.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ msg: 'Acción no autorizada.' });
    }

    const documento = new Documento(req.body);
    documento.caso = casoId;
    documento.subidoPor = req.usuario._id;

    try {
        const documentoGuardado = await documento.save();
        res.status(201).json(documentoGuardado);
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

export {
    obtenerDocumentosPorCaso,
    agregarDocumento
};