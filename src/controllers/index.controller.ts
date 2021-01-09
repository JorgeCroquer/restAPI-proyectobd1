import {Request, Response} from 'express'
import {pool} from '../database'
import {QueryResult} from 'pg'

//Funciones de respuesta

export const getEmpleados = async(req: Request,res: Response): Promise<Response> => {
    try{
        const response: QueryResult = await pool.query('SELECT cedula, nombre, salario_emp, horarioent, horariosal FROM pruebaemp');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getUsersById = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createUser = async(req: Request,res: Response): Promise<Response> => {
    try{
        const{nombre,email} = req.body
        const response: QueryResult = await pool.query('INSERT INTO users (nombre,email) VALUES ($1,$2)', [nombre,email]);
        return res.status(200).json({
            message: "User created successfully",
            body: {
                user: {
                    nombre,
                    email
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateUser = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const {nombre,email} = req.body
        const response: QueryResult = await pool.query('UPDATE users SET nombre = $1, email = $2 WHERE id = $3', [nombre,email,id]);
        return res.status(200).json(`User ${id} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteUser = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return res.status(200).json(`User ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
