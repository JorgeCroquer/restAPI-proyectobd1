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
exports.logIn = exports.signUp = exports.encryptPassword = exports.getRandomInt = void 0;
const database_1 = require("../database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const persona_natural_1 = require("../Clases/persona_natural");
const persona_juridica_1 = require("../Clases/persona_juridica");
const QR_1 = require("../Clases/QR");
const usuario_1 = require("../Clases/usuario");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PoolEnUso = database_1.pool;
// Retorna un entero aleatorio entre min (incluido) y max (excluido)
// ¡Usando Math.round() te dará una distribución no-uniforme!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.getRandomInt = getRandomInt;
function asignarPathEmp() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield PoolEnUso.query('SELECT fk_cedula_nat FROM empleado');
        for (let i in response.rows) {
            PoolEnUso.query('UPDATE empleado SET pathimagen_pro= $1 WHERE fk_cedula_nat = $2', [`C:/ImagenesBD/empleados/${getRandomInt(1, 49)}.png`, response.rows[i].fk_cedula_nat]);
        }
        console.log('listo');
    });
}
function llenarTelefonos() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield PoolEnUso.query(`SELECT fk_rif_jur
        FROM cliente_jur`);
        for (let i = 0; i < response.rows.length; i++) {
            if (i < 10) {
                const escritura = yield PoolEnUso.query(`INSERT INTO telefono (numero_tel, compania_tel,fk_persona_jur) 
                                                            VALUES ($1, $2, $3)`, [`41423719${i}`, 'Movistar', response.rows[i].fk_rif_jur]);
            }
            else {
                const escritura = yield PoolEnUso.query(`INSERT INTO telefono (numero_tel, compania_tel,fk_persona_jur) 
                                                            VALUES ($1, $2, $3)`, [`4123581${i}`, 'Digitel', response.rows[i].fk_rif_jur]);
            }
            console.log(i);
        }
        console.log('listo');
    });
}
//Funcion para encriptar un password
function encryptPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        return yield bcrypt_1.default.hash(password, salt);
    });
}
exports.encryptPassword = encryptPassword;
function comparePasswords(encryptedPassword, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(encryptedPassword);
        return yield bcrypt_1.default.compare(password, encryptedPassword);
    });
}
function createToken(id, rol) {
    return jsonwebtoken_1.default.sign({ id: id, rol: rol }, process.env.JWT_Secret || 'somesecrettoken', { expiresIn: 86400 /*24 horas*/ });
}
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //hay que obtener todo lo necesario para insertar una persona y su usuario
        const { tipo, user, email, password, rol, telefono, sucursalEmpleado, cedula, rif, primernombre, segundonombre, primerapellido, segundoapellido, persona_contacto, codigo_residencia, contacto, razon_social, denom_comercial, web, capital, direccion_fisica, direccion_fiscal } = req.body;
        //Una mini validacion
        if (!email || !password || !user || !telefono) {
            res.status(400).json({ message: 'Faltan campos' });
            return;
        }
        //Llevare el telefono a un formato valido
        var TelefonoFormateado;
        if (telefono.startsWith('04')) {
            var TelefonoFormateado = telefono.split('0', 2)[1];
        }
        else if (telefono.startsWith('+584')) {
            var TelefonoFormateado = telefono.split('+58', 2)[1];
        }
        else if (telefono.startsWith('00584')) {
            var TelefonoFormateado = telefono.split('0058', 2)[1];
        }
        else if (telefono.startsWith('+58-')) {
            var TelefonoFormateado = telefono.split('+58-', 2)[1];
        }
        else {
            return res.status(400).json({ message: 'Telefono incorrecto' });
        }
        //Verificamos que el usuario no exista 
        var newUser = new usuario_1.usuario(user, email, password, [rol]);
        if (yield newUser.existeEnBD()) {
            res.status(400).json({ message: 'Ya existe un usuario con ese nombre o esa direccion e-mail' });
            return;
        }
        //Se encripta el password
        const encryptedPassword = yield encryptPassword(password);
        //Se determina la comania telefonica
        var compania;
        if (TelefonoFormateado.startsWith('412')) {
            compania = 'Digitel';
        }
        else if (TelefonoFormateado.startsWith('414') || TelefonoFormateado.startsWith('424')) {
            compania = 'Movistar';
        }
        else if (TelefonoFormateado.startsWith('416') || TelefonoFormateado.startsWith('426')) {
            compania = 'Movilnet';
        }
        else {
            compania = 'Desconocida';
        }
        switch (tipo) {
            case 'nat': {
                //Busco por el rif del contacto
                if (contacto) {
                    console.log(contacto);
                    const contactosjur = yield PoolEnUso.query(`SELECT rif_jur
                 FROM persona_juridica
                 WHERE rif_jur = $1`, [contacto]);
                    if (contactosjur.rows.length == 0) {
                        return res.status(400).json({ message: 'El rif del contacto no existe' });
                    }
                }
                //Verificamos que no exista esa persona natural
                var newPersonaNat = new persona_natural_1.persona_natural(cedula, rif, primernombre, segundonombre, primerapellido, segundoapellido, persona_contacto, codigo_residencia);
                if (yield newPersonaNat.existeEnBD()) {
                    res.status(400).json({ message: `La persona con cedula ${cedula} ya esta registrada` });
                    return;
                }
                const sucursalesCercanas = yield PoolEnUso.query(`SELECT s.codigo_suc
                FROM sucursal s JOIN lugar parroquiasuc on s.fk_lugar = parroquiasuc.codigo_lug
                                JOIN lugar municipiosuc on parroquiasuc.fk_lugar_lug = municipiosuc.codigo_lug
                                JOIN lugar estadosuc on estadosuc.codigo_lug = municipiosuc.fk_lugar_lug,
                lugar parroquia JOIN lugar municipio on parroquia.fk_lugar_lug = municipio.codigo_lug
                                JOIN lugar estado on estado.codigo_lug = municipio.fk_lugar_lug
                WHERE (municipiosuc.codigo_lug = municipio.codigo_lug OR estadosuc.codigo_lug = estado.codigo_lug) 
                    AND parroquia.codigo_lug = $1`, [codigo_residencia]);
                const sucursal = sucursalesCercanas.rows[0].codigo_suc;
                //Insertamos la persona natural
                const InsercionNat = yield PoolEnUso.query(`INSERT INTO persona_natural 
                                                                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [cedula, rif, primernombre, segundonombre, primerapellido, segundoapellido, new Date(), `C:\\ImagenesBD\\QR\\${cedula}.png`, contacto, codigo_residencia]);
                //Insertemos telefono
                const InsercionTel = yield PoolEnUso.query(`INSERT INTO telefono (numero_tel, compania_tel, fk_persona_nat)
                                                                   VALUES ($1,$2,$3)`, [TelefonoFormateado, compania, cedula]);
                if (rol == 1) {
                    //Insertamos al cliente
                    const InsercionCli = yield PoolEnUso.query(`INSERT INTO cliente_nat 
                                                                        VALUES ($1,$2,$3,$4)`, [cedula, false, 0, sucursal]);
                    //Generamos el QR del nuevo cliente
                    yield QR_1.QR.generarQR(cedula, `cedula: ${cedula}, 
                                            nombre: ${primernombre} ${primerapellido}
                                            email: ${email},
                                            telefono: ${telefono},
                                            ID: ${sucursal}-${cedula}`);
                }
                else {
                    `cedula: ${cedula}, 
                                nombre: ${primernombre} ${primerapellido}
                                email: ${email},
                                telefono: ${telefono},
                                ID: ${sucursalEmpleado}-${cedula}`;
                    //Insertamos al empleado
                    var imagen = getRandomInt(1, 49);
                    const InsercionEmp = yield PoolEnUso.query(`INSERT INTO empleado 
                                                                        VALUES ($1,$2,$3,$4)`, [cedula, 100000, `assets/img/empleados/${imagen}.png`, 1]);
                }
                //ahora si creamo el usuario
                const InsercionUser = yield PoolEnUso.query(`INSERT INTO usuarios (nombre_usu, password_usu, direccion_ema, fk_roles,fk_persona_nat) 
                                                                    VALUES ($1,$2,$3,$4,$5)`, [user, encryptedPassword, email, rol, cedula]);
                return res.status(201).json({ message: `El usuario ${user} fue registrado exitosamente` });
            }
            case 'jur': {
                //Verificamos que no exista esa persona juridica
                var newPersonaJur = new persona_juridica_1.persona_juridica(rif, razon_social, denom_comercial, web, capital, direccion_fisica, direccion_fiscal);
                if (yield newPersonaJur.existeEnBD()) {
                    res.status(400).json({ message: `La persona con RIF ${rif} ya esta registrada` });
                    return;
                }
                const sucursalesCercanas = yield PoolEnUso.query(`SELECT s.codigo_suc
                FROM sucursal s JOIN lugar parroquiasuc on s.fk_lugar = parroquiasuc.codigo_lug
                                JOIN lugar municipiosuc on parroquiasuc.fk_lugar_lug = municipiosuc.codigo_lug
                                JOIN lugar estadosuc on estadosuc.codigo_lug = municipiosuc.fk_lugar_lug,
                lugar parroquia JOIN lugar municipio on parroquia.fk_lugar_lug = municipio.codigo_lug
                                JOIN lugar estado on estado.codigo_lug = municipio.fk_lugar_lug
                WHERE (municipiosuc.codigo_lug = municipio.codigo_lug OR estadosuc.codigo_lug = estado.codigo_lug) 
                    AND parroquia.codigo_lug = $1`, [direccion_fisica]);
                const sucursal = sucursalesCercanas.rows[0].codigo_suc;
                //Insertamos la persona natural
                const InsercionJur = yield PoolEnUso.query(`INSERT INTO persona_juridica 
                                                                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [rif, razon_social, denom_comercial, web, capital, new Date(), `C:\\ImagenesBD\\QR\\${rif}.png`, direccion_fisica, direccion_fiscal]);
                const InsercionTel = yield PoolEnUso.query(`INSERT INTO telefono (numero_tel, compania_tel, fk_persona_jur)
                                                                   VALUES ($1,$2,$3)`, [TelefonoFormateado, compania, rif]);
                //Generamos el QR del nuevo cliente
                yield QR_1.QR.generarQR(rif, `rif: ${rif}, 
                                     nombre: ${razon_social}
                                     email: ${email},
                                     telefono: ${telefono},
                                     ID: ${sucursal}-${rif}`);
                //Insertamos al cliente
                const InsercionCli = yield PoolEnUso.query(`INSERT INTO cliente_jur 
                                                                    VALUES ($1,$2,$3,$4)`, [rif, 0, false, sucursal]);
                //ahora si creamos el usuario
                const InsercionUser = yield PoolEnUso.query(`INSERT INTO usuarios (nombre_usu, password_usu, direccion_ema, fk_roles,fk_persona_jur) 
                                                                    VALUES ($1,$2,$3,$4,$5)`, [user, encryptedPassword, email, rol, rif]);
                return res.status(201).json({ message: `El usuario ${user} fue registrado exitosamente` });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.signUp = signUp;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //Una mini validacion
        if (!email || !password) {
            res.status(400).json({ message: 'Faltan campos' });
            return;
        }
        //Verifiquemos si el usuario existe
        const responseUsu = yield PoolEnUso.query(`SELECT codigo_usu AS ID,
                                                                    nombre_usu AS username,
                                                                    direccion_ema AS email, 
                                                                    password_usu AS encryptedpassword, 
                                                                    fk_roles AS rol
                                                            FROM usuarios
                                                            WHERE direccion_ema = $1`, [email]);
        if (responseUsu.rows.length != 1) {
            res.status(400).json({ message: `No hay una cuenta asociada a la direccion ${email}` });
            return;
        }
        var usuario = responseUsu.rows[0];
        //Si el usuario es empleado...
        if (usuario.rol > 1 && usuario.rol != 11) {
            const responseEmp = yield PoolEnUso.query(`
            SELECT fk_sucursal AS sucursal, l.nombre_lug AS lugar
            FROM empleado E JOIN usuarios U ON E.fk_cedula_nat = U.fk_persona_nat
                    JOIN sucursal s on E.fk_sucursal = s.codigo_suc
                    JOIN lugar l on s.fk_lugar = l.codigo_lug
            WHERE direccion_ema = $1`, [usuario.email]);
            if (responseEmp.rows.length == 1) {
                //Estos solo son headers paar empleados
                res.header('sucursal', responseEmp.rows[0].sucursal);
                res.header('zona', responseEmp.rows[0].lugar);
            }
        }
        if ((yield comparePasswords(usuario.encryptedpassword, password)) == false) {
            res.status(400).json({ message: 'Direccion de e-mail o contraseña invalidos' });
            return;
        }
        //adjuntamos los header
        res.header('auth-token', createToken(usuario.id, usuario.rol));
        res.header('rol', usuario.rol);
        //Esto es para exponer los headers a los navegadores (Por defecto se les oculta)
        res.header('Access-Control-Expose-Headers', ['auth-Token', 'sucursal', 'rol', 'zona']);
        res.status(200).json({ message: 'Sesion iniciada correctamente',
            body: {
                user: usuario.username
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.logIn = logIn;
