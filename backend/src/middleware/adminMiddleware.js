const esAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'admin') {
        next();
    } else {
        const error = new Error('Acceso denegado. Se requiere rol de Administrador.');
        return res.status(403).json({ msg: error.message });
    }
};

export default esAdmin;