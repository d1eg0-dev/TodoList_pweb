require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 3000;

console.log("Entró a server.js");

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});