const express = require('express');

const app = express();

// Importar rutas
const todoRoutes = require('./routes/todo.routes');

// Importar middleware de errores
const errorHandler = require('./middleware/error.middleware');


// Middleware JSON
app.use(express.json());


// Ruta principal
app.get('/', (req, res) => {
    res.send('API funcionando');
});


// Rutas API
app.use('/api/todos', todoRoutes);


// Middleware global de errores
app.use(errorHandler);


module.exports = app;