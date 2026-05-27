const NodeCache = require('node-cache');


// Crear cache
const cache = new NodeCache({
    stdTTL: 60
});


// Middleware cache
const cacheMiddleware = (req, res, next) => {

    const key = req.originalUrl;

    // Buscar en cache
    const cachedData = cache.get(key);

    // Si existe en cache
    if (cachedData) {

        console.log('Datos obtenidos desde cache');

        return res.status(200).json(cachedData);

    }

    // Guardar función original
    const originalJson = res.json;

    // Sobrescribir json
    res.json = function (body) {

        cache.set(key, body);

        return originalJson.call(this, body);

    };

    next();

};


module.exports = {
    cache,
    cacheMiddleware
};