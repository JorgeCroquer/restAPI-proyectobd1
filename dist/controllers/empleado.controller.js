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
exports.updateEmpleado = exports.getBeneficios = exports.despedir = exports.getEmpleadosBySucursal = exports.getEmpleados = void 0;
const database_1 = require("../database");
const PoolEnUso = database_1.pool;
//empleados
const getEmpleados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`SELECT fk_cedula_nat AS cedula,
                                                                    salario_emp AS salario,
                                                                    fk_sucursal AS codigo_sucursal
                                                             FROM Empleado`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getEmpleados = getEmpleados;
const getEmpleadosBySucursal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sucursal = req.params.id;
        const response = yield PoolEnUso.query(`SELECT pn.cedula_nat AS cedula,
                    pn.primernombre_nat AS primernombre,
                    pn.segundonombre_nat AS segundonombre,
                    pn.primerapellido_nat AS primerapellido,
                    pn.segundoapellido_nat AS segundoapellido,
                    COALESCE(pn.rif_nat, 'No posee') AS rif,
                    e.salario_emp AS salario,
                    pn.fecharegistro_nat AS fecharegistro,
                    CONCAT('+58-',t.numero_tel) AS telefono,
                    h.horaentrada_hor AS horaentrada,
                    h.horasalida_hor AS horasalida,
                    CONCAT('assets/img/',split_part(pathimagen_pro, '/', 3), '/',split_part(pathimagen_pro, '/', 4) ) AS url,
                    v.iniciovacaciones_emp AS iniciovacas,
                    v.final_vacaciones_emp AS finvacas,
                    u.nombre_usu AS usuario,
                    u.direccion_ema AS email
            FROM persona_natural pn JOIN empleado e ON pn.cedula_nat = e.fk_cedula_nat
                    JOIN sucursal s ON e.fk_sucursal = s.codigo_suc
                    JOIN telefono t ON pn.cedula_nat = t.fk_persona_nat
                    JOIN horario_empleado he ON e.fk_cedula_nat = he.fk_empleado
                    JOIN horario h ON he.fk_horario = h.codigo_hor
                    JOIN vacaciones v ON e.fk_cedula_nat = v.fk_empleado
                    JOIN usuarios u ON u.fk_persona_nat = pn.cedula_nat
            WHERE e.fk_sucursal = $1`, [sucursal]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getEmpleadosBySucursal = getEmpleadosBySucursal;
const despedir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cedula = req.params.id;
        const response = yield PoolEnUso.query(`DELETE FROM empleado
             WHERE fk_cedula_nat = $1`, [cedula]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.despedir = despedir;
const getBeneficios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cedula = req.params.id;
        const response = yield PoolEnUso.query(`SELECT b.codigo_ben AS id_ben, b.nombre_ben AS nombre, b.descripcion_ben AS descripcion
             FROM empleado e JOIN beneficio_empleado be ON e.fk_cedula_nat = be.fk_empleado_ben_emp
                 JOIN beneficio b ON be.fk_beneficio_ben_emp = b.codigo_ben
                 JOIN vacaciones v on e.fk_cedula_nat = v.fk_empleado
            
             WHERE e.fk_cedula_nat = $1`, [cedula]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getBeneficios = getBeneficios;
const updateEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cedula = req.params.id;
        const { primernombre, segundonombre, primerapellido, segundoapellido, email, iniciovacas, finvacas, horaentrada, horasalida, rif, salario, telefono, usuario } = req.body;
        const persona = yield PoolEnUso.query(`UPDATE persona_natural
             SET primernombre_nat = $1,
                 segundonombre_nat = $2,
                 primerapellido_nat = $3,
                 segundoapellido_nat = $4,
                 rif_nat = $5
             WHERE cedula_nat = $6`, [primernombre, segundonombre, primerapellido, segundoapellido, rif, cedula]);
        const empleado = yield PoolEnUso.query(`UPDATE empleado
             SET salario_emp = $1
             WHERE fk_cedula_nat = $2`, [salario, cedula]);
        console.log(telefono.split('-')[1]);
        //Primero busco a ver si ya existe ese numero de telefono
        const buscarTel = yield PoolEnUso.query(`SELECT numero_tel
             FROM telefono
             WHERE numero_tel = $1 AND fk_persona_nat <> $2`, [telefono.split('-')[1], cedula]);
        if (buscarTel.rows.length == 0) {
            //Si no hay entonces actualizo
            const tel = yield PoolEnUso.query(`UPDATE telefono
                 SET numero_tel = $1
                 WHERE fk_persona_nat = $2`, [telefono.split('-')[1], cedula]);
        }
        else
            return res.status(400).json({ message: 'El telefono ya esta en uso' });
        //Primero busco a ver si ya existe ese usuario o correo
        const buscarUser = yield PoolEnUso.query(`SELECT codigo_usu
             FROM usuarios
             WHERE ((nombre_usu = $1 OR direccion_ema = $2) AND (fk_persona_nat <> $3 OR fk_persona_nat is null))`, [usuario, email, cedula]);
        if (buscarUser.rows.length == 0) {
            //Si no existe entonces actualizo
            const user = yield PoolEnUso.query(`UPDATE usuarios
                 SET nombre_usu = $1, direccion_ema = $2
                 WHERE fk_persona_nat = $3`, [usuario, email, cedula]);
        }
        else
            return res.status(400).json({ message: 'El nombre de usuario o el email ya estan en uso' });
        //Primero busco a ver si ya existe ese horario
        const buscarHorario = yield PoolEnUso.query(`SELECT codigo_hor
             FROM horario
             WHERE horaentrada_hor = $1 AND horasalida_hor = $2`, [horaentrada, horasalida]);
        if (buscarHorario.rows.length === 1) {
            //Si existe lo asigno
            const asignarHorario = yield PoolEnUso.query(`UPDATE horario_empleado
                 SET fk_horario = $1
                 WHERE fk_empleado = $2`, [buscarHorario.rows[0].codigo_hor, cedula]);
        }
        else if (buscarHorario.rows.length === 0) {
            //Si no existe, creo uno nuevo y se lo asigno
            const nuevoHorario = yield PoolEnUso.query(`INSERT INTO horario (horaentrada_hor,horasalida_hor)
                 VALUES ($1,$2) RETURNING codigo_hor`, [horaentrada, horasalida]);
            const asignarHorario = yield PoolEnUso.query(`UPDATE horario_empleado
                 SET fk_horario = $1
                 WHERE fk_empleado = $2`, [nuevoHorario.rows[0].codigo_hor, cedula]);
        }
        //verificamos que no sea igual a las vacaciones que ya tiene
        const buscarVacacion = yield PoolEnUso.query(`SELECT codigo_vac
             FROM vacaciones
             WHERE fk_empleado = $1 
                AND iniciovacaciones_emp = $2
                AND final_vacaciones_emp = $3`, [cedula, iniciovacas, finvacas]);
        console.log(buscarVacacion.rows.length == 0);
        if (buscarVacacion.rows.length == 0) {
            const nuevaVacacion = yield PoolEnUso.query(`INSERT INTO vacaciones (iniciovacaciones_emp, final_vacaciones_emp, fk_empleado)
                 VALUES ($1,$2,$3)`, [iniciovacas, finvacas, cedula]);
        }
        return res.status(200).json({ message: 'Empleado actualizado' });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateEmpleado = updateEmpleado;
