const isAuthenticated = (req, res, next) => {

    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    if (req.session.user) {
        return next();
    }

    return res.status(401).json({
        message: 'No autorizado'
    });

};

module.exports = {
    isAuthenticated
};