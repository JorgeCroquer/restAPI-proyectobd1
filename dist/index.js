"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const database_1 = require("./database");
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const cors = require('cors');
const morgan = require('morgan');
const XLSX = require('xlsx');
const app = express_1.default();
const multiPartMiddleware = multipart({ uploadDir: 'src/uploads' });
//settings
app.set('port', process.env.PORT || 3000);
//Middlewares
app.use(morgan('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//Routes
app.use('/api', index_1.default);
//Excel receive function
const ExcelToJSON = (path) => {
    const excel = XLSX.readFile(path);
    var sheetName = excel.SheetNames;
    let datos = XLSX.utils.sheet_to_json(excel.Sheets[sheetName[0]], { cellDates: true });
    //Interpretacion de fechas
    const jDatos = [];
    for (let i = 0; i < datos.length; i++) {
        const dato = datos[i];
        jDatos.push(Object.assign(Object.assign({}, dato), { horaent: new Date((dato.horaent - (25567 + 2)) * 86400 * 1000), horasal: new Date((dato.horasal - (25567 + 2)) * 86400 * 1000) }));
    }
    // console.log(jDatos);
    return jDatos;
};
//Funcion de rango de tolerancia
function Tolerancia(minutes, someDate, hacer) {
    //getTime() devuelve los milisegundos entre 1/1/1970 y la fecha en cuestion
    //El constructor de Date se le puede pasar los milisegundos que han transcurrido hasta la fecha que se quiere
    //se le suma 1000*60*minutos a los milisegundos de la fecha dada. El 1 sumado es por un error de la conversion de dates
    if (hacer == 0)
        return new Date(someDate.getTime() + 1 - 1000 * 60 * minutes); //si hacer es 0, la tolerancia se resta
    else if (hacer == 1)
        return new Date(someDate.getTime() + 1 + 1000 * 60 * minutes); //si hacer es 1, la tolerancia se suma
    else {
        console.error('Error en los parametros de tolarencia: solo se acepta 0 para restar o 1 para sumar');
        return (someDate);
    }
}
//Excel receive Route
app.post('/api/empreport', multiPartMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.files);
    var asistencia = ExcelToJSON(req.files.EmpleadosExcel.path);
    const response = yield database_1.pool.query(`SELECT cedula_nat,primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat,horaentrada_hor,horasalida_hor
         FROM horario_empleado,empleado, horario
         WHERE ((cedula_nat = horario_empleado.fk_empleado) AND (horario.codigo_hor = fk_horario))`);
    // console.log(response.rows);
    var EmpleadosListos = []; //Aqui se van guardando los empleados chequeados
    for (let i = 0; i <= 1; i++) {
        let entradaTarde = false;
        let salidaTemprana = false;
        //Busquemos su horario
        //entrada
        var horaEStr = response.rows[i].horaentrada_hor.toString();
        var t = horaEStr.split(":");
        var HorarioEntrada = new Date(0, 0, 1, t[0], t[1], t[2]); //Solo la hora. El resto de la fecha esta mal.
        //salida
        var horaSStr = response.rows[i].horasalida_hor.toString();
        var t = horaSStr.split(":");
        var HorarioSalida = new Date(0, 0, 1, t[0], t[1], t[2]); //Solo la hora. El resto de la fecha esta mal.
        //busquemos la hora a la que entro
        //entrada
        let HoraEntrada = Tolerancia(5, asistencia[i].horaent, 0); //Aplicamos una tolerancia de -5min
        //salida
        let HoraSalida = Tolerancia(5, asistencia[i].horasal, 1); //Aplicamos una tolerancia de +5min
        //comparemos las horas de entrada
        if (HoraEntrada.getUTCHours() > HorarioEntrada.getHours()) { //if hora de entrada es mayor a su horario...
            entradaTarde = true;
        }
        else if (HoraEntrada.getUTCHours() == HorarioEntrada.getHours()) {
            //Hay que comparar los minutos
            if (HoraEntrada.getMinutes() > HorarioEntrada.getMinutes()) { //if hora de entrada es mayor a su horario...
                entradaTarde = true;
            }
        }
        console.log(HoraEntrada.getUTCHours() > HorarioEntrada.getHours());
        //comparemos las horas de salida
        if (HoraSalida.getUTCHours() < HorarioSalida.getHours()) { //if hora de entrada es mayor a su horario...
            salidaTemprana = true;
        }
        else if (HoraSalida.getUTCHours() == HorarioSalida.getHours()) {
            //Hay que comparar los minutos
            if (HoraSalida.getMinutes() < HorarioSalida.getMinutes()) { //if hora de entrada es mayor a su horario...
                salidaTemprana = true;
            }
        }
        const escritura = yield database_1.pool.query('INSERT INTO prueba_reporte VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [parseInt(asistencia[i].cedula), response.rows[i].primernombre_nat, response.rows[i].segundonombre_nat, response.rows[i].primerapellido_nat, response.rows[i].segundoapellido_nat, asistencia[i].horaent, asistencia[i].horasal, !(entradaTarde || salidaTemprana)]);
        EmpleadosListos.push({
            cedula: parseInt(asistencia[i].cedula),
            primernombre: response.rows[i].primernombre_nat,
            segundonombre: response.rows[i].segundonombre_nat,
            primerapellido: response.rows[i].primerapellido_nat,
            segundoapellido: response.rows[i].segundoapellido_nat,
            horaEntrada: asistencia[i].horaent,
            horaSalida: asistencia[i].horasal,
            cumplio: !(entradaTarde || salidaTemprana)
        });
    } //end For
    console.log(EmpleadosListos); // FALTA ARREGLAR LA CONSULTA 
}));
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
