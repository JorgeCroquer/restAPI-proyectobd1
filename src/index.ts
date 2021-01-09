import express from 'express'
import { Request, Response} from 'express'
import indexRoutes from './routes/index'
import {QueryResult} from 'pg'
import {pool} from './database'
import {EmpleadoListo} from './interfaces/EmpleadoListo'


const bodyParser = require ('body-parser');
const multipart = require ('connect-multiparty');
const cors = require('cors');
const morgan = require('morgan');
const XLSX = require('xlsx');

const app = express();

const multiPartMiddleware = multipart({uploadDir: 'src/uploads'})

//settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

//Routes
app.use('/api',indexRoutes);

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




//Excel receive Route
app.post('/api/empreport', multiPartMiddleware, async(req: Request, res: Response) =>{
    res.json(req.files);

    var asistencia = ExcelToJSON(req.files.EmpleadosExcel.path);

    const response: QueryResult = await pool.query('SELECT horaentrada_hor, horasalida_hor FROM horario');
    
    
    var EmpleadosListos: EmpleadoListo[] = []; //Aqui se van guardando los empleados chequeados


    for (let i = 0; i <= 1; i++){
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
        console.log(HoraEntrada.getUTCHours()  >  HorarioEntrada.getHours());

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



        EmpleadosListos.push({
            cedula: parseInt(asistencia[i].cedula), 
            nombre: asistencia[i].nombre,
            horaEntrada: asistencia[i].horaent, 
            horaSalida: asistencia[i].horasal,
            cumplio: !(entradaTarde || salidaTemprana)})
    }//end For


console.log(EmpleadosListos); // FALTA ARREGLAR LA CONSULTA 


})


app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
})