import {Request, Response} from 'express'
import {pool} from '../database'
import {QueryResult} from 'pg'

//Funciones de respuesta

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

//Tiendas

export const getTiendas = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await pool.query('SELECT codigo_suc as codigo, nombre_suc as nombre, nombre_lug as direccion FROM sucursal,lugar WHERE codigo_lug = fk_lugar ORDER BY codigo_suc');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateTienda = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const id = parseInt(req.params.id);
        const {nombre} = req.body;
        const response: QueryResult = await pool.query('UPDATE sucursal SET nombre_suc = $1 WHERE codigo_suc = $2', [nombre,id]);
        return res.status(200).json(`Tienda ${id} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteTienda = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('DELETE FROM sucursal WHERE codigo_suc = $1', [id]);
        return res.status(200).json(`tienda ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createTienda = async(req: Request,res: Response): Promise<Response> => {
    try{
        const{nombre,codigo_dir} = req.body
        const response: QueryResult = await pool.query('INSERT INTO sucursal(nombre_suc,fk_lugar) VALUES ($1,$2)', [nombre,codigo_dir]);
        return res.status(200).json({
            message: "Sucursal created successfully",
            body: {
                sucursal: {
                    nombre,
                    codigo_dir
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

//Luagares 
export const getLugares = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await pool.query('SELECT codigo_lug as codigo, nombre_lug as nombre, tipo_lugar as tipo, fk_lugar_lug as codigo_en FROM  lugar');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

//proveedores

export const getProveedores = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await pool.query('SELECT * FROM proveedor ORDER BY rif_jur');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createProveedor = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur} = req.body;
        const response: QueryResult = await pool.query('INSERT INTO proveedor VALUES ($1,$2,$3,$4,$5,$6,$7)',[rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur]);
        return res.status(200).json({
            message: "Proveedor created successfully",
            body: {
                Proveedor: {
                    rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateProveedor = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const {rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur} = req.body;
        const response: QueryResult = await pool.query('UPDATE proveedor SET razonsocial_jur = $1,dencomercial_jur = $2, web_jur = $3, capital_jur = $4, fecharegistro_jur = $5, registrofisico_jur = $6  WHERE rif_jur = $7', [razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur,rif_jur]);
        return res.status(200).json(`Tienda ${rif_jur} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteProveedor = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = req.params.id;
        const response: QueryResult = await pool.query('DELETE FROM proveedor WHERE rif_jur = $1', [id]);
        return res.status(200).json(`Proveedor ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

//empleados

export const getEmpleados = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await pool.query('SELECT cedula_nat, salario_emp, rif_nat, primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat, fecharegistro_nat,registrofisico_nat, nombre_suc FROM empleado,sucursal WHERE codigo_suc = fk_sucursal ORDER BY cedula_nat');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}