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
Object.defineProperty(exports, "__esModule", { value: true });
exports.compararHorarios = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
const XLSX = require('xlsx');
//Excel receive function
const ExcelToJSON = (path) => {
    const excel = XLSX.readFile(path);
    var sheetName = excel.SheetNames;
    let datos = XLSX.utils.sheet_to_json(excel.Sheets[sheetName[0]]);
    return datos;
};
const compararHorarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Este es un JSON con la info del archivo
        var archivoJSON = req.files;
        var asistencia = ExcelToJSON(archivoJSON.EmpleadosExcel.path);
        var Cedulas = [];
        //Llenamos un array con las cedulas presentes en el excel, y aprovechamos para insertar
        for (let i in asistencia) {
            Cedulas.push(parseInt(asistencia[i].cedula));
            const insertarAsistencia = yield PoolEnUso.query(`INSERT INTO asistencia
             VALUES ($1,$2,$3,$4)`, [asistencia[i].cedula, new Date().toLocaleDateString('en-US'), asistencia[i].horaent, asistencia[i].horasal]);
        }
        return res.status(201).json({ message: 'Asistencias cargadas con exito' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});
exports.compararHorarios = compararHorarios;
