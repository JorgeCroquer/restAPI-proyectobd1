import {Request, Response} from 'express'
import {LocalPool, pool} from '../database'
import {Query, QueryResult} from 'pg'
import { persona_natural } from '../Clases/persona_natural';
import { QR } from '../Clases/QR';
import {encryptPassword, getRandomInt} from './auth.controller'


const PoolEnUso = pool;

//empleados

export const getEmpleados = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(`SELECT fk_cedula_nat AS cedula,
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


export const getEmpleadosBySucursal = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const sucursal = req.params.id
        const response: QueryResult = await PoolEnUso.query(
            `SELECT pn.cedula_nat AS cedula,
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
                    u.direccion_ema AS email,
                    u.fk_roles AS rol
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
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const despedir = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const cedula = req.params.id;
        const vacaciones = await PoolEnUso.query(
            `DELETE FROM vacaciones
             WHERE fk_empleado = $1`, [cedula]);
        
        const horario = await PoolEnUso.query(
            `DELETE FROM horario_empleado
             WHERE fk_empleado = $1`, [cedula]);

        const empleado: QueryResult = await PoolEnUso.query(
            `DELETE FROM empleado
             WHERE fk_cedula_nat = $1`, [cedula]);

        const usuario = await PoolEnUso.query(
            `DELETE FROM usuarios
             WHERE fk_persona_nat = $1`, [cedula]);

        return res.status(200).json({message: `Empleado ${cedula} eliminado`});
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getBeneficios = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const cedula = req.params.id
        const response: QueryResult = await PoolEnUso.query(
            `SELECT b.codigo_ben AS id_ben, b.nombre_ben AS nombre, b.descripcion_ben AS descripcion
             FROM empleado e JOIN beneficio_empleado be ON e.fk_cedula_nat = be.fk_empleado_ben_emp
                 JOIN beneficio b ON be.fk_beneficio_ben_emp = b.codigo_ben
                 JOIN vacaciones v on e.fk_cedula_nat = v.fk_empleado
            
             WHERE e.fk_cedula_nat = $1`, [cedula]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateEmpleado = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const cedula = req.params.id
        const { primernombre,
                segundonombre,
                primerapellido,
                segundoapellido,
                email,
                iniciovacas,
                finvacas,
                horaentrada,
                horasalida,
                rif,
                salario,
                telefono,
                usuario,
                rol} = req.body
        
        const persona: QueryResult = await PoolEnUso.query(
            `UPDATE persona_natural
             SET primernombre_nat = $1,
                 segundonombre_nat = $2,
                 primerapellido_nat = $3,
                 segundoapellido_nat = $4,
                 rif_nat = $5
             WHERE cedula_nat = $6`, [primernombre,segundonombre,primerapellido,segundoapellido,rif,cedula]);
    
        const empleado: QueryResult = await PoolEnUso.query(
            `UPDATE empleado
             SET salario_emp = $1
             WHERE fk_cedula_nat = $2`, [salario, cedula]);


        
        //Primero busco a ver si ya existe ese numero de telefono
        const buscarTel: QueryResult = await PoolEnUso.query(
            `SELECT numero_tel
             FROM telefono
             WHERE numero_tel = $1 AND fk_persona_nat <> $2`, [telefono.split('-')[1], cedula])
        if (buscarTel.rows.length == 0){
            //Si no hay entonces actualizo

            //Deteremino la compania
            var compania:string;
            if (telefono.split('-')[1].startsWith('412')){
                compania = 'Digitel'
            }else if (telefono.split('-')[1].startsWith('414') || telefono.startsWith('424')){
                compania = 'Movistar'
            }else if (telefono.split('-')[1].startsWith('416') || telefono.startsWith('426')){
                compania = 'Movilnet'
            }else{
                compania = 'Desconocida'
            }
            const tel: QueryResult = await PoolEnUso.query(
                `UPDATE telefono
                 SET numero_tel = $1, compania_tel = $2
                 WHERE fk_persona_nat = $3`, [telefono.split('-')[1],compania,cedula]);
        }else return res.status(400).json({message: 'El telefono ya esta en uso'})


        //Primero busco a ver si ya existe ese usuario o correo
        const buscarUser: QueryResult = await PoolEnUso.query(
            `SELECT codigo_usu
             FROM usuarios
             WHERE ((nombre_usu = $1 OR direccion_ema = $2) AND (fk_persona_nat <> $3 OR fk_persona_nat is null))`, [usuario,email, cedula])
        if (buscarUser.rows.length == 0){
            //Si no existe entonces actualizo
            const user: QueryResult = await PoolEnUso.query(
                `UPDATE usuarios
                 SET nombre_usu = $1, direccion_ema = $2, fk_roles = $3
                 WHERE fk_persona_nat = $4`, [usuario,email,rol,cedula]);

        }else return res.status(400).json({message: 'El nombre de usuario o el email ya estan en uso'})


        //Primero busco a ver si ya existe ese horario
        const buscarHorario: QueryResult = await PoolEnUso.query(
            `SELECT codigo_hor
             FROM horario
             WHERE horaentrada_hor = $1 AND horasalida_hor = $2`, [horaentrada,horasalida])

        if( buscarHorario.rows.length === 1 ){
            //Si existe lo asigno
            const asignarHorario: QueryResult = await PoolEnUso.query(
                `UPDATE horario_empleado
                 SET fk_horario = $1
                 WHERE fk_empleado = $2`, [buscarHorario.rows[0].codigo_hor, cedula]);
        }else if (buscarHorario.rows.length === 0){
            //Si no existe, creo uno nuevo y se lo asigno
            const nuevoHorario: QueryResult = await PoolEnUso.query(
                `INSERT INTO horario (horaentrada_hor,horasalida_hor)
                 VALUES ($1,$2) RETURNING codigo_hor`,[horaentrada,horasalida])
            const asignarHorario: QueryResult = await PoolEnUso.query(
                `UPDATE horario_empleado
                 SET fk_horario = $1
                 WHERE fk_empleado = $2`, [nuevoHorario.rows[0].codigo_hor, cedula]);    
        }

        //verificamos que no sea igual a las vacaciones que ya tiene
        const buscarVacacion: QueryResult = await PoolEnUso.query(
            `SELECT codigo_vac
             FROM vacaciones
             WHERE fk_empleado = $1 
                AND iniciovacaciones_emp = $2
                AND final_vacaciones_emp = $3`, [cedula, iniciovacas, finvacas])
        console.log(buscarVacacion.rows.length == 0)
        if (buscarVacacion.rows.length == 0){
            const nuevaVacacion: QueryResult = await PoolEnUso.query(
                `INSERT INTO vacaciones (iniciovacaciones_emp, final_vacaciones_emp, fk_empleado)
                 VALUES ($1,$2,$3)`,[iniciovacas, finvacas, cedula])
  
        }   
        

                
        return res.status(200).json({message: 'Empleado actualizado'});
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createEmpleado = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const sucursal = req.params.id;
        const { primernombre,
            segundonombre,
            primerapellido,
            segundoapellido,
            cedula,
            parroquia,
            email,
            iniciovacas,
            finvacas,
            horaentrada,
            horasalida,
            rif,
            salario,
            telefono,
            usuario,
            password,
            rol} = req.body

        //Llevare el telefono a un formato valido
       var TelefonoFormateado
        if (telefono.startsWith('04')){
            var TelefonoFormateado = telefono.split('0',2)[1]
        }else if(telefono.startsWith('+584')){
            var TelefonoFormateado = telefono.split('+58',2)[1]
        }else if(telefono.startsWith('00584')){
            var TelefonoFormateado = telefono.split('0058',2)[1]
        }else if(telefono.startsWith('+58-')){
            var TelefonoFormateado = telefono.split('+58-',2)[1]
        }else{
            return res.status(400).json({message: 'Telefono incorrecto'})
        }


         //Ahora busco en la BD por datos repetidos y actuo en consecuencia
        const buscarCedula: QueryResult = await PoolEnUso.query(
            `SELECT cedula_nat
             FROM persona_natural
             WHERE cedula_nat = $1 OR rif_nat = $2`,[cedula,rif])

            const buscarEmpleado: QueryResult = await PoolEnUso.query(
                `SELECT fk_cedula_nat
                 FROM empleado
                 WHERE fk_cedula_nat = $1`, [cedula]);
            if (buscarEmpleado.rows.length == 0){
                
                const buscarTel: QueryResult = await PoolEnUso.query(
                    `SELECT numero_tel
                     FROM telefono
                     WHERE numero_tel = $1 AND fk_persona_nat <> $2`, [TelefonoFormateado, cedula])
                if (buscarTel.rows.length == 0){

                    const buscarUser: QueryResult = await PoolEnUso.query(
                        `SELECT codigo_usu
                         FROM usuarios
                         WHERE nombre_usu = $1 OR direccion_ema = $2`, [usuario,email])
                    if (buscarUser.rows.length == 0){

                        console.log('paso filtros')


                    }else return res.status(400).json({message: 'El nombre de usuario o el email ya estan en uso'})

                }

            }else return res.status(400).json({message: 'Ya existe un empleado con esta cedula'})
        

            //ya paso todos los filtros

            //Aqui vuelvo a preguntar, por si ya existia la persona pero no el empleado
            if (buscarCedula.rows.length == 0){
            //Agrego a la persona
            const agregarPersona: QueryResult = await PoolEnUso.query(
                `INSERT INTO persona_natural
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                 [cedula,rif,primernombre,segundonombre,primerapellido,segundoapellido,new Date().toLocaleDateString('en-US'),`C:\\ImagenesBD\\QR\\${cedula}.png`, null, parroquia])
            QR.generarQR(cedula,`cedula: ${cedula}, 
                                nombre: ${primernombre} ${primerapellido}
                                email: ${email},
                                telefono: ${telefono},
                                ID: ${sucursal}-${cedula}`)
            console.log('persona')
            }
            
        

            //Agrego al empleado

            //Le asigno una imagen aleatoria
            const imagen = getRandomInt(1,49);

            const agregarEmpleado: QueryResult = await PoolEnUso.query(
                `INSERT INTO empleado
                 VALUES ($1,$2,$3,$4)`,
                 [cedula,salario,`C:/ImagenesBD/empleados/${imagen}.png`, sucursal])

                 console.log('empleado')
        


        //Telefono

        //Determino la compania
        var compania:string;
        if (TelefonoFormateado.startsWith('412')){
            compania = 'Digitel'
        }else if (TelefonoFormateado.startsWith('414') || TelefonoFormateado.startsWith('424')){
            compania = 'Movistar'
        }else if (TelefonoFormateado.startsWith('416') || TelefonoFormateado.startsWith('426')){
            compania = 'Movilnet'
        }else{
            compania = 'Desconocida'
        }

        const tel: QueryResult = await PoolEnUso.query(
            `INSERT INTO telefono
             VALUES ($1,$2,$3,$4)`, [TelefonoFormateado,compania,null,cedula]);        
                console.log('telefono')
    

        //Usuario

        //Encripto la contrasena
        const encryptedPassword = await encryptPassword(password)
        const user: QueryResult = await PoolEnUso.query(
            `INSERT INTO usuarios (nombre_usu,password_usu,direccion_ema,fk_roles,fk_persona_nat)
             VALUES ($1,$2,$3,$4,$5)`, [usuario,encryptedPassword,email,rol,cedula]);
                console.log('usuario')

        

        //Vacaciones
        const nuevaVacacion: QueryResult = await PoolEnUso.query(
            `INSERT INTO vacaciones (iniciovacaciones_emp, final_vacaciones_emp, fk_empleado)
             VALUES ($1,$2,$3)`,[iniciovacas, finvacas, cedula])
             console.log('vacacion')

        //Horario
        const buscarHorario: QueryResult = await PoolEnUso.query(
            `SELECT codigo_hor
             FROM horario
             WHERE horaentrada_hor = $1 AND horasalida_hor = $2`, [horaentrada,horasalida])

             if( buscarHorario.rows.length === 1 ){
                //Si existe lo asigno
                const asignarHorario: QueryResult = await PoolEnUso.query(
                    `INSERT INTO horario_empleado 
                     VALUES ($1,$2)`, [cedula, buscarHorario.rows[0].codigo_hor]);
                     console.log('horario1')
            }else if (buscarHorario.rows.length === 0){
                //Si no existe, creo uno nuevo y se lo asigno
                const nuevoHorario: QueryResult = await PoolEnUso.query(
                    `INSERT INTO horario (horaentrada_hor,horasalida_hor)
                     VALUES ($1,$2) RETURNING codigo_hor`,[horaentrada,horasalida])
                const asignarHorario: QueryResult = await PoolEnUso.query(
                    `INSERT INTO horario_empleado
                     VALUES ($1,$2)`, [cedula,nuevoHorario.rows[0].codigo_hor]);
                     console.log('horario1')   
            }



        return res.status(201).json({message: `El empleado ${cedula} fue creado exitosamente`})
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

export const asistencias = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {fecha} = req.body
        const asistencia: QueryResult = await PoolEnUso.query(
            `SELECT CONCAT(pn.primernombre_nat,' ',pn.primerapellido_nat) AS nombre,
                cedula_nat AS cedula,
                horaentrada_hor AS horaentrada,
                horasalida_hor AS horasalida,
                COALESCE(horaentrada_asi::varchar(9), 'No asistió') AS entradaasi,
                COALESCE(horasalida_asi::varchar(9), 'No asistió') AS salidaasi,
                CASE
                    WHEN horaentrada_hor + '1 hr'::INTERVAL < horaentrada_asi THEN true
                    ELSE false
                END entrada_tarde,
                CASE
                    WHEN horasalida_hor - '1 hr'::INTERVAL > horasalida_asi THEN true
                    ELSE false
                END salida_temprana,
                CASE
                    --cuando entre tarde op salga temprano entonces no cumple (1 HORA DE TOLERANCIA)
                    WHEN horaentrada_hor + '1 hr'::INTERVAL < horaentrada_asi OR horasalida_hor - '1 hr'::INTERVAL > horasalida_asi THEN false
                    ELSE true
                END cumplio
            FROM persona_natural pn JOIN empleado e ON pn.cedula_nat = e.fk_cedula_nat
                JOIN asistencia a on e.fk_cedula_nat = a.fk_empleado
                JOIN horario_empleado he on e.fk_cedula_nat = he.fk_empleado
                JOIN horario h on he.fk_horario = h.codigo_hor
            WHERE a.fecha_asi = $1`,[fecha])

        return res.status(200).json(asistencia.rows);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error')
    }
}

