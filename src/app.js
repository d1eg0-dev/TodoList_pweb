const express = require('express');

const cors = require('cors');

const app = express();

const todoRoutes = require('./routes/todo.routes');

const errorHandler = require('./middleware/error.middleware');


// Middleware
app.use(cors());

app.use(express.json());


// Ruta principal
app.get('/', (req, res) => {
    res.send('API funcionando');
});


// Rutas
app.use('/api/todos', todoRoutes);


// Middleware errores
app.use(errorHandler);


module.exports = app;