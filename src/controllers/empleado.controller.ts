import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'


const PoolEnUso = LocalPool;

//empleados

export const getEmpleados = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await LocalPool.query(`SELECT fk_cedula_nat AS cedula,
                                                                    salario_emp AS salario,
                                                                    fk_sucursal AS codigo_sucursal
                                                             FROM Empleado`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}




