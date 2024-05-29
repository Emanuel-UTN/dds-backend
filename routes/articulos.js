import express from 'express';
const router = express.Router();

import db from '../base-orm/sequelize-init.js';
import { Op, ValidationError } from 'sequelize';

router.get('/api/articulos', async (req, res) => {
    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'Obtener todos los articulos'
    // Consulta de articulos con filtros y paginacion

    let where = {}
    if(req.query.Nombre != undefined && req.query.Nombre !== ''){
        where.Nombre = {
            [Op.substring]: req.query.Nombre
        };
    }
    if(req.query.Activo != undefined && req.query.Activo !== ''){
        where.Activo = req.query.Activo === 'true';
    }

    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;

    const { count, rows } = await db.articulos.findAndCountAll({
        attributes: ["IdArticulo", "Nombre", "Precio", "Stock", "FechaAlta", "Activo"],
        order: [["Nombre", "ASC"]],
        where,
        offset: (Pagina - 1) * TamañoPagina,
        limit: TamañoPagina
    });

    return res.json({ Items: rows, RegistrosTotal: count });
});

router.get('/api/articulos/:id', async (req, res) => {
    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'Obtener un articulo por Id'
    // #swagger.parameters['id'] = { description: 'Identificador del articulo...' }

    let items = await db.articulos.findOne({
        attributes: ["IdArticulo", "Nombre", "Precio", "CodigoDeBarra", "IdArticuloFamilia", "Stock", "FechaAlta", "Activo"],
        where: { IdArticulo: req.params.id }
    });
    res.json(items);
});

router.post('/api/articulos/', async (req, res) => {
    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'Crear un articulo'
    /* #swagger.parameters['item'] = {
        in: 'body',
        description: 'Nuevo articulo',
        schema: { $ref: "#/definitions/Articulos" }
    } */

    try {
        let data = await db.articulos.create({
            Nombre: req.body.Nombre,
            Precio: req.body.Precio,
            CodigoDeBarra: req.body.CodigoDeBarra,
            IdArticuloFamilia: req.body.IdArticuloFamilia,
            Stock: req.body.Stock,
            FechaAlta: req.body.FechaAlta,
            Activo: req.body.Activo
        });

        res.status(201).json(data.dataValues);  // Devolvemos el registro agregado!
    } catch (err) {
        if (err instanceof ValidationError){
            let messages = '';
            err.errors.forEach(error => {
                messages += (error.path ?? 'campo') + ": " + error.message + "\n";
            });
            res.status(400).json({ message: messages});
        }else{
            throw err;
        }
    }
});

router.put('/api/articulos/:id', async (req, res) => {
    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'Actualizar un articulo'
    // #swagger.parameters['id'] = { description: 'Identificador del articulo...' }
    /* #swagger.parameters['Articulo'] = {
        in: 'body',
        description: 'Articulo a actualizar',
        schema: { $ref: "#/definitions/Articulos" }
    } */

    try {
        let item = await db.articulos.findOne({
            attributes: ["IdArticulo", "Nombre", "Precio", "CodigoDeBarra", "IdArticuloFamilia", "Stock", "FechaAlta", "Activo"],
            where: { IdArticulo: req.params.id }
        });

        if(!item){
            res.status(404).json({ message: 'Articulo no encontrado!'});
            return
        }
        // Actualizamos los campos
        item.Nombre = req.body.Nombre;
        item.Precio = req.body.Precio;
        item.CodigoDeBarra = req.body.CodigoDeBarra;
        item.IdArticuloFamilia = req.body.IdArticuloFamilia;
        item.Stock = req.body.Stock;
        item.FechaAlta = req.body.FechaAlta;
        item.Activo = req.body.Activo;
        // Guardamos los cambios
        await item.save();

        res.sendStatus(204);

    } catch (err) {
        if(err instanceof ValidationError){
            let messages = '';
            err.errors.forEach(error => {
                messages += (error.path ?? 'campo') + ": " + error.message + "\n";
            });
            res.status(400).json({ message: messages});
        }else{
            throw err;
        }
    }
});

router.delete('/api/articulos/:id', async (req, res) => {
    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'Eliminar un articulo'
    // #swagger.parameters['id'] = { description: 'Identificador del articulo...' }

    let bajaFisica = false;

    if(bajaFisica){ // Baja Fisica
        let filasBorradas = await db.articulos.destroy({
            where: { IdArticulo: req.params.id }
        });

        if(filasBorradas == 1) res.sendStatus(200);
        else res.sendStatus(404);
    }else{ // Baja Logica
        try {
            let data = await db.sequelize.query("UPDATE articulos SET Activo = CASE WHEN Activo = 1 THEN 0 ELSE 1 END WHERE IdArticulo = :IdArticulo",
            {
                replacements: { IdArticulo: +req.params.id }
            });
            res.sendStatus(200);

        } catch (err) {
            if(err instanceof ValidationError){
                let messages = '';
                err.errors.forEach(error => {
                    messages += (error.path ?? 'campo') + ": " + error.message + "\n";
                });
                res.status(400).json({ message: messages});
            }else{
                throw err;
            }
        }
    }
});

export default router;