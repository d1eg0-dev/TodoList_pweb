const errorHandler = (err, req, res, next) => {

    console.error(err.stack);

    res.header('API-Error', 'true');

    res.status(err.status || 500).json({

        error: true,

        metadata: {
            status: err.status || 500,
            timestamp: new Date()
        },

        message: err.message || 'Error interno del servidor'

    });

};

module.exports = errorHandler;