const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Agregar esta línea

const app = express();

const todoRoutes = require('./routes/todo.routes');
const fileRoutes = require('./routes/file.routes'); // Agregar esta línea
const errorHandler = require('./middleware/error.middleware');

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({ // Agregar este middleware
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
}));

// Ruta principal
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Rutas
app.use('/api/todos', todoRoutes);
app.use('/api/files', fileRoutes); 

// Middleware errores
app.use(errorHandler);

module.exports = app;