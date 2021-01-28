import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'

import {EmpleadoListo} from '../interfaces/EmpleadoListo'


//Aqui se pone la BD que esta en uso
const PoolEnUso = LocalPool

const EmpListos = require('../../EmpleadosListos.json')
const XLSX = require('xlsx');
const fs = require('fs');


//Excel receive function
const ExcelToJSON = (path: string) =>{
    const excel = XLSX.readFile(path); 
    var sheetName = excel.SheetNames;
    let datos = XLSX.utils.sheet_to_json(excel.Sheets[sheetName[0]], {cellDates: true})

    //Interpretacion de fechas
    const jDatos = [];
    for (let i = 0; i < datos.length; i++) {
    const dato = datos[i];
    jDatos.push({
      ...dato,
      horaent: new Date((dato.horaent - (25567 + 2)) * 86400 * 1000),
      horasal: new Date((dato.horasal - (25567 + 2)) * 86400 * 1000)
    });
    }
   // console.log(jDatos);
    return jDatos;
}

//Funcion de rango de tolerancia
 function Tolerancia(minutes: number, someDate: Date, hacer:number) :Date{
    //getTime() devuelve los milisegundos entre 1/1/1970 y la fecha en cuestion
    //El constructor de Date se le puede pasar los milisegundos que han transcurrido hasta la fecha que se quiere
    //se le suma 1000*60*minutos a los milisegundos de la fecha dada. El 1 sumado es por un error de la conversion de dates

    if (hacer == 0)
        return new Date(someDate.getTime() +1 - 1000 * 60 * minutes) //si hacer es 0, la tolerancia se resta
    else if (hacer == 1)
        return new Date(someDate.getTime() +1 + 1000 * 60 * minutes)  //si hacer es 1, la tolerancia se suma
    else{
        console.error('Error en los parametros de tolarencia: solo se acepta 0 para restar o 1 para sumar');
        return (someDate); 
    } 
}


export const compararHorarios = async(req: Request, res: Response) =>{
    res.status(200).json({
        message: 'Excel recibido'
    });

    //Este es un JSON con la info del archivo
    var archivoJSON:any = req.files
    var asistencia = ExcelToJSON(archivoJSON.EmpleadosExcel.path);
    var Cedulas: number[] = [];

    //Llenamos un array con las cedulas presentes en el excel
    for (let i in asistencia){
         Cedulas.push(parseInt(asistencia[i].cedula));
    }

    

    const response: QueryResult = await PoolEnUso.query(
        `SELECT cedula_nat,primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat,horaentrada_hor,horasalida_hor
        FROM  persona_natural, empleado, horario_empleado, horario
        WHERE fk_cedula_nat= horario_empleado.fk_empleado 
              AND cedula_nat = fk_empleado 
              AND codigo_hor= horario_empleado.fk_horario
              AND cedula_nat IN (${Cedulas.toString()})`, 
         );

   var EmpleadosListos: EmpleadoListo[] = []; //Aqui se van guardando los empleados chequeados


    for (let i in response.rows){
        let entradaTarde: boolean = false;
        let salidaTemprana: boolean = false;
        
        //Busquemos su horario

        //entrada
        var horaEStr = response.rows[i].horaentrada_hor.toString();
        var t=horaEStr.split(":");
        var HorarioEntrada = new Date(0,0,1,t[0],t[1],t[2]); //Solo la hora. El resto de la fecha esta mal.

        //salida
        var horaSStr = response.rows[i].horasalida_hor.toString();
        var t=horaSStr.split(":");
        var HorarioSalida = new Date(0,0,1,t[0],t[1],t[2]); //Solo la hora. El resto de la fecha esta mal.


        //busquemos la hora a la que entro

        //entrada
        let HoraEntrada = Tolerancia(5,asistencia[i].horaent,0) //Aplicamos una tolerancia de -5min
        //salida
        let HoraSalida = Tolerancia(5,asistencia[i].horasal,1) //Aplicamos una tolerancia de +5min
        

        //comparemos las horas de entrada
        if (HoraEntrada.getUTCHours()  >  HorarioEntrada.getHours()){  //if hora de entrada es mayor a su horario...
            entradaTarde = true;
        }
        else if(HoraEntrada.getUTCHours()  ==  HorarioEntrada.getHours()){
            //Hay que comparar los minutos
            if (HoraEntrada.getMinutes()  >  HorarioEntrada.getMinutes()){  //if hora de entrada es mayor a su horario...
                entradaTarde = true;
            }
        }

        //comparemos las horas de salida
        if (HoraSalida.getUTCHours()  <  HorarioSalida.getHours()){  //if hora de entrada es mayor a su horario...
            salidaTemprana = true;
        }
        else if(HoraSalida.getUTCHours()  ==  HorarioSalida.getHours()){
            //Hay que comparar los minutos
            if (HoraSalida.getMinutes()  <  HorarioSalida.getMinutes()){  //if hora de entrada es mayor a su horario...
                salidaTemprana = true;
            }
        }
        


        // const escritura: QueryResult = await pool.query('INSERT INTO prueba_reporte VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        // [parseInt(asistencia[i].cedula),response.rows[i].primernombre_nat,response.rows[i].segundonombre_nat,response.rows[i].primerapellido_nat,response.rows[i].segundoapellido_nat, asistencia[i].horaent, asistencia[i].horasal, !(entradaTarde || salidaTemprana)]);
        var options = {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        //console.log(HoraEntrada.toLocaleDateString("es-US",options),);
        EmpleadosListos.push({
            Empleado:{
                cedula: parseInt(asistencia[i].cedula), 
                primernombre: response.rows[i].primernombre_nat,
                segundonombre: response.rows[i].segundonombre_nat,
                primerapellido: response.rows[i].primerapellido_nat,
                segundoapellido: response.rows[i].segundoapellido_nat,
                horaEntrada: HoraEntrada, 
                horaSalida: HoraSalida,
                cumplio: !(entradaTarde || salidaTemprana)
            }
        });

    }//end For

    //Guardamos un json para poderlo exportar
    var json = JSON.stringify(EmpleadosListos);
    fs.writeFile('EmpleadosListos.json', json, (err: Error) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        console.log('Json salvado')
    });

};

export const enviarAReporte = async(req: Request, res: Response) =>{

    await res.json(EmpListos);
}

