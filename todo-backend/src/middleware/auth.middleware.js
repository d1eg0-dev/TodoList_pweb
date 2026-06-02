// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();  // Usuario logueado - continúa
    }
    res.status(401).json({ error: 'No autorizado. Inicia sesión primero.' });
};

module.exports = { isAuthenticated };