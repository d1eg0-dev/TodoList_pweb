const express = require('express');
const router = express.Router();
const passport = require('passport');

// Ruta para INICIAR sesión con Google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']  // Qué información pedimos
    })
);

// Ruta donde GOOGLE REDIRIGE después de la autenticación
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: 'https://localhost:5173/dashboard',  // A donde va si funciona
        failureRedirect: 'https://localhost:5173/login'      // A donde va si falla
    })
);

// Ruta para CERRAR sesión
router.get('/logout', (req, res) => {

    delete req.session.user;

    req.logout((err) => {

        if (err) {

            return res.status(500).json({
                error: 'Error al cerrar sesión'
            });

        }

        req.session.destroy(() => {

            res.json({
                message: 'Sesión cerrada exitosamente'
            });

        });

    });

});

// Ruta para obtener el USUARIO ACTUAL (ver si está logueado)
router.get('/current-user', (req, res) => {

    // Usuario docente
    if (req.session.user) {

        return res.json({
            isAuthenticated: true,
            user: {
                id: req.session.user.id,
                username: req.session.user.username,
                role: req.session.user.role
            }
        });

    }

    // Usuario Google
    if (req.isAuthenticated()) {

        return res.json({
            isAuthenticated: true,
            user: {
                id: req.user.id,
                displayName: req.user.displayName,
                email: req.user.email,
                photo: req.user.photo
            }
        });

    }

    return res.json({
        isAuthenticated: false,
        user: null
    });

});

module.exports = router;