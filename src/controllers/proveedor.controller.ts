import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'


//proveedores

export const getProveedores = async(req: Request, res: Response): Promise<Response> =>{
    try{
        // const response: QueryResult = await pool.query('SELECT * FROM proveedor ORDER BY rif_jur');
        const response: QueryResult = await LocalPool.query('SELECT * FROM persona_juridica WHERE rif_jur IN (SELECT fk_rif_jur FROM proveedor)');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createProveedor = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {fk_rif_jur,marca_propia} = req.body;
        const response: QueryResult = await LocalPool.query('INSERT INTO proveedor VALUES ($1,$2)',[fk_rif_jur,marca_propia]);
        return res.status(201).json({
            message: "Proveedor created successfully",
            body: {
                Proveedor: {
                    fk_rif_jur,marca_propia
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
        const {fk_rif_jur,marca_propia} = req.body;
        const response: QueryResult = await LocalPool.query('UPDATE proveedor SET marca_propia = $1  WHERE fk_rif_jur = $2', [marca_propia,fk_rif_jur]);
        return res.status(200).json(`Proveedor ${fk_rif_jur} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteProveedor = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = req.params.id;
        const response: QueryResult = await LocalPool.query('DELETE FROM proveedor WHERE fk_rif_jur = $1', [id]);
        return res.status(200).json(`Proveedor ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}