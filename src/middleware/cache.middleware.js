const NodeCache = require('node-cache');

// Cache por 60 segundos
const cache = new NodeCache({
    stdTTL: 60
});

const verifyCache = (req, res, next) => {

    const key = req.originalUrl;

    const cachedData = cache.get(key);

    if (cachedData) {

        console.log('Respuesta desde CACHE');

        return res.status(200).json(cachedData);
    }

    console.log('Respuesta desde MONGODB');

    res.sendResponse = res.json;

    res.json = (body) => {

        cache.set(key, body);

        res.sendResponse(body);
    };

    next();
};

module.exports = verifyCache;