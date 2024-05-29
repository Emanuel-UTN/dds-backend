import express from 'express';
const router = express.Router();

import db from '../base-orm/sequelize-init.js';

router.get('/api/articulosfamilias', async (req, res) => {
    let data = await db.articulos_familias.findAll({
        attributes: ['IdArticuloFamilia', 'Nombre']
    });
    res.json(data);
});

router.get('/api/articulosfamilias/:id', async (req, res) => {
    let data = await db.articulos_familias.findByPk(req.params.id);
    res.json(data);
});

export default router;