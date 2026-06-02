const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const passport = require('./config/passport.config');

const app = express();

const todoRoutes = require('./routes/todo.routes');
const fileRoutes = require('./routes/file.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');



// ============ MIDDLEWARE ============
app.use(cors({
    origin: 'http://localhost:5173',  // Puerto de React
    credentials: true  // Permitir cookies de sesión
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión (NECESARIO para Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,  // 24 horas
        httpOnly: true
    }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }
}));

// ============ RUTAS ============
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Rutas públicas
app.use('/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
const { isAuthenticated } = require('./middleware/auth.middleware');
app.use('/api/todos', isAuthenticated, todoRoutes);
app.use('/api/files', isAuthenticated, fileRoutes);

// ============ MIDDLEWARE ERRORES ============
app.use(errorHandler);

module.exports = app;