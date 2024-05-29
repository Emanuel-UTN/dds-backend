import express from 'express';
const router = express.Router();

import jwt from 'jsonwebtoken';
import auth from '../seguridad/auth.js';

const users = [
    {
        usuario: 'admin',
        clave: '123',
        rol: 'admin'
    },
    {
        usuario: 'juan',
        clave: '123',
        rol: 'member'
    },
    {
        usuario: 'manu',
        clave: '123',
        rol: 'member'
    }
];
let refreshTokens = [];

router.post('/api/login', (req, res) => {
    // #swagger.tags = ['Seguridad']
    // #swagger.summary = 'Login de usuarios: admin:123(rol administrador), juan:123(rol miembro), manu:123(rol miembro)'

    const { usuario, clave } = req.body;

    const user = users.find(u => {
        return u.usuario === usuario && u.clave === clave
    });

    if(user){
        // Generar access token
        const accessToken = jwt.sign(
            { usuario: user.usuario, rol: user.rol },
            auth.accessTokenSecret,
            { expiresIn: '20m' }
        );

        // Avanzado!
        const refreshToken = jwt.sign(
            { usuario: user.usuario, rol: user.rol },
            auth.refreshTokenSecret
        );

        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken,
            message: "Bienvenido " + user.usuario + "!"
        });
    }else{
        res.json({error: 'Usuario o clave incorrectos'});
    }
});

router.post('/api/logout', (req, res) => {
    // #swagger.tags = ['Seguridad']
    // #swagger.summary = 'Logout: invalida el refresh token (no invalida el token actual!!!)'

    // Aqui evitamos que pueda renovarse el token cuando se expire!
    let message = "Logout invalido!";
    const { token } = req.body;
    if(refreshTokens.includes(token)){
        message = "Usuario deslogueado correctamente!";
    }

    refreshTokens = refreshTokens.filter(t => t !== token);

    res.json({message});
});

router.post('/api/token', (req, res) => {
    // #swagger.tags = ['Seguridad']
    // #swagger.summary = 'Renovar el token'

    const { refreshToken } = req.body;

    if(!refreshToken){
        return res.sendStatus(401);
    }

    if(!refreshTokens.includes(refreshToken)){
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, auth.refreshTokenSecret, (err, user) => {
        if(err){
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
            { usuario: user.usuario, rol: user.rol },
            auth.accessTokenSecret,
            { expiresIn: '20m' }
        );

        res.json({ accessToken });
    });
});

export default router;