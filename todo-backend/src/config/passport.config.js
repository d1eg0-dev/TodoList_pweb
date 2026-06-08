const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
require('dotenv').config();

// Configurar la estrategia de Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Perfil de Google recibido:', profile.id);
        
        // Buscar si el usuario ya existe
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            // Usuario existe - actualizar último login
            user.lastLogin = Date.now();
            await user.save();
            console.log('Usuario existente:', user.email);
            return done(null, user);
        }
        
        // Usuario nuevo - crear en la base de datos
        user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0]?.value || ''
        });
        
        console.log('Usuario nuevo creado:', user.email);
        return done(null, user);
    } catch (error) {
        console.error('Error en GoogleStrategy:', error);
        return done(error, null);
    }
}));

// Serializar usuario (guardar solo el ID en la sesión)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializar usuario (obtener datos completos desde el ID)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;