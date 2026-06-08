const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {

    const { username, password } = req.body;

    if (
        username === 'docente' &&
        password === 'docente123'
    ) {

        // Eliminar sesión Passport si existe
        req.logout((err) => {

            req.session.user = {
                id: 1,
                username: 'docente',
                role: 'teacher'
            };

            req.session.save((err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error al guardar sesión'
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Login correcto',
                    user: req.session.user
                });

            });

        });

        return;
    }

    return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
    });

});

router.get('/current-user', (req, res) => {

    if (req.session.user) {

        return res.status(200).json({
            isAuthenticated: true,
            user: req.session.user
        });

    }

    return res.status(200).json({
        isAuthenticated: false
    });

});

module.exports = router;