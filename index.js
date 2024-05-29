import express from 'express';
import './base-orm/sqlite-init.js'; // crear base si no existe
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

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

// Normalizar las rutas
const __filename = fileURLToPath(import.meta.url);

// Verificar si el módulo actual es el principal
if (__filename === process.argv[1]) {
    const port = process.env.PORT || 3000;
    app.locals.fechaInicio = new Date();
    app.listen(port, () => {
        console.log(`Servidor iniciado en http://localhost:${port}`);
    });
}

export default app; // exportar app para testearlo
