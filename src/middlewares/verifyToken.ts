import { Request, Response, NextFunction} from 'express'

import jwt from 'jsonwebtoken'



//Interface para el objeto encriptado en el token
interface Idecode{
    id: number,
    rol:number,
    iat: number,
    exp: number
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    try {

        //reading the headers
        const token:string = req.headers['auth-token'] as string;
        if (token == ''){
            return res.status(403).json({message: 'auth-token missing'})
        }
        try {
            //Se decodifica el jwt con el string secreto y se castea con la interfaz Idecode
            const decoded = jwt.verify(token, process.env.JWT_Secret || 'somesecrettoken') as Idecode
            req.userId = decoded.id
            req.userRol = decoded.rol
        
        } catch (error) {
            console.error(error);
            return res.status(401).json({message: 'Acceso Restringido'});
        }


        //cedemos el control a la funcion que maneja la peticion
        next();

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
    

}