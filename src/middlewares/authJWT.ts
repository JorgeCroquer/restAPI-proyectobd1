import { Request, Response, NextFunction} from 'express'

import jwt from 'jsonwebtoken'
import {LocalPool,pool} from '../database'
import {QueryResult} from 'pg'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

//Interfaz para el objeto encriptado en el token
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
            console.log(req.userId)
        
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

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {


    try {
        

        //Verificamos que el rol del usuario es 11(Admin)
        if (req.userRol ===  11){
                //Hacemos una comprobacion en la BD
            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
            if (ValidacionRol.rows.length === 1 && ValidacionRol.rows[0].rol === 11 && ValidacionRol.rows[0].id === req.userId){
                next();
                return;
            }
    
        }

        //No es admin
        return res.status(401).json({message: 'Acceso Restringido'});



    } catch (error){

        console.error(error)
        res.status(500).json({message: 'Internal server error'})

    }
    

}

export const isGerenteGeneral = async (req: Request, res: Response, next: NextFunction) => {

    try {
        

        //Verificamos que el rol del usuario es 10(Gerente) o 11(Admin)
        if (req.userRol  >= 10){
            //Hacemos una comprobacion en la BD
        const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                    FROM usuarios
                                                                    WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
        if (ValidacionRol.rows.length === 1 && ValidacionRol.rows[0].rol >= 10 && ValidacionRol.rows[0].id === req.userId){
            next();
            return;
        }
        }

        //No es gerente
        return res.status(401).json({message: 'Acceso Restringido'});



    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }

}

export const isGerenteVentasEnLinea = async (req: Request, res: Response, next: NextFunction) => {

    try {

                //Verificamos que el rol del usuario es 9(ger. Ventas en Linea) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol >=  9){
            //Hacemos una comprobacion en la BD
        const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                    FROM usuarios
                                                                    WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
        if (ValidacionRol.rows.length === 1 && ValidacionRol.rows[0].rol >= 9 && ValidacionRol.rows[0].id === req.userId){
            next();
            return;
        }
        }

        //No es gerente de ventas en linea
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }


}

export const isGerentePromos = async (req: Request, res: Response, next: NextFunction) => {

    try {

        //Verificamos que el rol del usuario es 8(ger. Promos) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol ===  8 || req.userRol ===  10 || req.userRol ===  11){
            //Hacemos una comprobacion en la BD\

            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])

            if (ValidacionRol.rows.length === 1 
                && (ValidacionRol.rows[0].rol === 8 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId){

                next();
                return;
            }
        }

        //No es gerente de promos
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
}

export const isGerenteTalentoHumano = async (req: Request, res: Response, next: NextFunction) => {

    try {

        //Verificamos que el rol del usuario es 7(ger. Talento Humano) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol ===  7 || req.userRol ===  10 || req.userRol ===  11){
            //Hacemos una comprobacion en la BD
            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
            if (ValidacionRol.rows.length === 1 
                && (ValidacionRol.rows[0].rol === 7 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId){

                next();
                return;
            }
        }

        //No es gerente de Talento Humano
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }

}

export const isGerenteReabastecimiento = async (req: Request, res: Response, next: NextFunction) => {

    try {

        //Verificamos que el rol del usuario es 6(ger. Reabastecimiento) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol ===  6 || req.userRol ===  10 || req.userRol ===  11){
            //Hacemos una comprobacion en la BD
            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
            if (ValidacionRol.rows.length === 1 
                && (ValidacionRol.rows[0].rol === 6 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId){

                next();
                return;
            }
        }

        //No es gerente de reabastecimiento
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }


}

export const isEncargadoPasillos = async (req: Request, res: Response, next: NextFunction) => {

    try {

        //Verificamos que el rol del usuario es 5(Encargado de pasillos) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol ===  5 || req.userRol ===  10 || req.userRol ===  11){
            //Hacemos una comprobacion en la BD
            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
            if (ValidacionRol.rows.length === 1 
                && (ValidacionRol.rows[0].rol === 5 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId){

                next();
                return;
            }
        }

        //No es gerente de promos
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }


}

export const isCajero = async (req: Request, res: Response, next: NextFunction) => {

    try {

        //Verificamos que el rol del usuario es 4(Cajero) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol ===  4 || req.userRol ===  10 || req.userRol ===  11){
            //Hacemos una comprobacion en la BD
            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
            if (ValidacionRol.rows.length === 1 
                && (ValidacionRol.rows[0].rol === 4 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId){

                next();
                return;
            }
        }

        //No es cajero
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }

}

export const isGerenteEntregas = async (req: Request, res: Response, next: NextFunction) => {

    try {

        //Verificamos que el rol del usuario es 3(ger. Entregas) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol ===  3 || req.userRol ===  10 || req.userRol ===  11){
            //Hacemos una comprobacion en la BD
            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
            if (ValidacionRol.rows.length === 1 
                && (ValidacionRol.rows[0].rol === 3 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId){

                next();
                return;
            }
        }

        //No es gerente de Entregas
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }


}

export const isGerenteDespacho = async (req: Request, res: Response, next: NextFunction) => {

    try {

        //Verificamos que el rol del usuario es 2(ger. Despacho) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol ===  2 || req.userRol ===  10 || req.userRol ===  11){
            //Hacemos una comprobacion en la BD
            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
            if (ValidacionRol.rows.length === 1 
                && (ValidacionRol.rows[0].rol === 2 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId){

                next();
                return;
            }
        }

        //No es gerente de Despacho
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
}

export const isCliente = async (req: Request, res: Response, next: NextFunction) => {

    try {

        //Verificamos que el rol del usuario es 8(ger. Promos) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol ===  1 || req.userRol ===  10 || req.userRol ===  11){
            //Hacemos una comprobacion en la BD
            const ValidacionRol: QueryResult = await PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol])
            if (ValidacionRol.rows.length === 1 
                && (ValidacionRol.rows[0].rol === 1 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId){

                next();
                return;
            }
        }

        //No es cliente
        return res.status(401).json({message: 'Acceso Restringido'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }


}