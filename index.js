import express from 'express';

// Crear el servidor
const app = express();

// Controlar la ruta
app.get('/', (req, res) => {
    res.send("Backend inicial dds-backend!!");
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});