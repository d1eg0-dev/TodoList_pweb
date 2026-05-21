const express = require('express');
const todoRoutes = require('./routes/todo.routes');

const app = express();

app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Rutas TODO
app.use('/api/todos', todoRoutes);

module.exports = app;