import jwt from 'jsonwebtoken';

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere'

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if(err){
                return res.status(403).json({error: 'token no es válido'});
            }

            res.locals.user = user;
            next();
        });
    }else{
        res.status(401).json({error: 'Acceso denegado'});
    }
};

export {accessTokenSecret, refreshTokenSecret, authenticateJWT};