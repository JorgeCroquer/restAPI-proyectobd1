import {Request, Response} from 'express'
import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'

import {EmpleadoListo} from '../interfaces/EmpleadoListo'
import { persona_juridica } from '../Clases/persona_juridica'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

const XLSX = require('xlsx');



//Excel receive function
const ExcelToJSON = (path: string) =>{
    const excel = XLSX.readFile(path); 
    var sheetName = excel.SheetNames;
    let datos = XLSX.utils.sheet_to_json(excel.Sheets[sheetName[0]])
    return datos;
}


export const compararHorarios = async(req: Request, res: Response) =>{
 try {
     

    //Este es un JSON con la info del archivo
    var archivoJSON:any = req.files
    var asistencia = ExcelToJSON(archivoJSON.EmpleadosExcel.path);
    var Cedulas: number[] = [];

    //Llenamos un array con las cedulas presentes en el excel, y aprovechamos para insertar
    for (let i in asistencia){
         Cedulas.push(parseInt(asistencia[i].cedula));

         const insertarAsistencia: QueryResult = await PoolEnUso.query(
            `INSERT INTO asistencia
             VALUES ($1,$2,$3,$4)`
             ,[asistencia[i].cedula,new Date().toLocaleDateString('en-US'),asistencia[i].horaent,asistencia[i].horasal])
             console.log(i)
    }
    return res.status(201).json({message: 'Asistencias cargadas con exito'})
    


} catch (error) {
     console.error(error)
     return res.status(500).send('Internal server error')
}
};







