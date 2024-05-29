import express from 'express';
import './base-orm/sqlite-init.js'; // crear base si no existe

// Crear el servidor
const app = express();
app.use(express.json());

// Agregar Routers
import articulosFamiliasRouter from './routes/articulosFamilias.js';
app.use(articulosFamiliasRouter);

// Controlar la ruta
app.get('/', (req, res) => {
    res.send("Backend inicial dds-backend!!");
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});