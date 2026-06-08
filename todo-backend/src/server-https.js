const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

// Conectar a MongoDB
connectDB();

// Leer los certificados SSL
const options = {
    key: fs.readFileSync(path.join(__dirname, '../certs/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem'))
};

const PORT = process.env.PORT || 3000;

console.log("Entró a server-https.js");

// Crear servidor HTTPS
const server = https.createServer(options, app);

server.listen(PORT, () => {
    console.log(`✅ Servidor HTTPS corriendo en https://localhost:${PORT}`);
    console.log(`⚠️  Nota: El navegador mostrará una advertencia de seguridad porque el certificado es autofirmado.`);
    console.log(`   Para desarrollo, haz clic en "Avanzado" → "Continuar a localhost"`);
});