import express from 'express';
import './base-orm/sqlite-init.js'; // crear base si no existe
import cors from 'cors';

// Crear el servidor
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*' // origin: 'https://dds-frontend.azurewebsites.net'
}));

// Agregar Routers
import articulosFamiliasRouter from './routes/articulosFamilias.js';
app.use(articulosFamiliasRouter);
import articulosRouter from './routes/articulos.js';
app.use(articulosRouter);
import seguridadRouter from './routes/seguridad.js';
app.use(seguridadRouter);

// Controlar la ruta
app.get('/', (req, res) => {
    res.send("Backend inicial dds-backend!!");
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});