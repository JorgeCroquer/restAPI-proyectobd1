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
exports.isCliente = exports.isGerenteDespacho = exports.isGerenteEntregas = exports.isCajero = exports.isEncargadoPasillos = exports.isGerenteReabastecimiento = exports.isGerenteTalentoHumano = exports.isGerentePromos = exports.isGerenteVentasEnLinea = exports.isGerenteGeneral = exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
const verifyToken = (req, res, next) => {
    try {
        //reading the headers
        const token = req.headers['auth-token'];
        if (token == '') {
            return res.status(403).json({ message: 'auth-token missing' });
        }
        try {
            //Se decodifica el jwt con el string secreto y se castea con la interfaz Idecode
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_Secret || 'somesecrettoken');
            req.userId = decoded.id;
            req.userRol = decoded.rol;
        }
        catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Acceso Restringido' });
        }
        //cedemos el control a la funcion que maneja la peticion
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 11(Admin)
        if (req.userRol === 11) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1 && ValidacionRol.rows[0].rol === 11 && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es admin
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isAdmin = isAdmin;
const isGerenteGeneral = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 10(Gerente) o 11(Admin)
        if (req.userRol >= 10) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                    FROM usuarios
                                                                    WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1 && ValidacionRol.rows[0].rol >= 10 && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es gerente
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isGerenteGeneral = isGerenteGeneral;
const isGerenteVentasEnLinea = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 9(ger. Ventas en Linea) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol >= 9) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                    FROM usuarios
                                                                    WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1 && ValidacionRol.rows[0].rol >= 9 && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es gerente de ventas en linea
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isGerenteVentasEnLinea = isGerenteVentasEnLinea;
const isGerentePromos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 8(ger. Promos) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol === 8 || req.userRol === 10 || req.userRol === 11) {
            //Hacemos una comprobacion en la BD\
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1
                && (ValidacionRol.rows[0].rol === 8 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es gerente de promos
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isGerentePromos = isGerentePromos;
const isGerenteTalentoHumano = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 7(ger. Talento Humano) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol === 7 || req.userRol === 10 || req.userRol === 11) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1
                && (ValidacionRol.rows[0].rol === 7 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es gerente de Talento Humano
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isGerenteTalentoHumano = isGerenteTalentoHumano;
const isGerenteReabastecimiento = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 6(ger. Reabastecimiento) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol === 6 || req.userRol === 10 || req.userRol === 11) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1
                && (ValidacionRol.rows[0].rol === 6 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es gerente de reabastecimiento
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isGerenteReabastecimiento = isGerenteReabastecimiento;
const isEncargadoPasillos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 5(Encargado de pasillos) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol === 5 || req.userRol === 10 || req.userRol === 11) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1
                && (ValidacionRol.rows[0].rol === 5 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es gerente de promos
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isEncargadoPasillos = isEncargadoPasillos;
const isCajero = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 4(Cajero) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol === 4 || req.userRol === 10 || req.userRol === 11) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1
                && (ValidacionRol.rows[0].rol === 4 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es cajero
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isCajero = isCajero;
const isGerenteEntregas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 3(ger. Entregas) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol === 3 || req.userRol === 10 || req.userRol === 11) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1
                && (ValidacionRol.rows[0].rol === 3 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es gerente de Entregas
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isGerenteEntregas = isGerenteEntregas;
const isGerenteDespacho = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 2(ger. Despacho) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol === 2 || req.userRol === 10 || req.userRol === 11) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1
                && (ValidacionRol.rows[0].rol === 2 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es gerente de Despacho
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isGerenteDespacho = isGerenteDespacho;
const isCliente = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Verificamos que el rol del usuario es 8(ger. Promos) o 10 (Ger. General) 0 11 (Admin)
        if (req.userRol === 1 || req.userRol === 10 || req.userRol === 11) {
            //Hacemos una comprobacion en la BD
            const ValidacionRol = yield PoolEnUso.query(`SELECT fk_roles AS rol, codigo_usu AS id 
                                                                        FROM usuarios
                                                                        WHERE codigo_usu = $1 AND fk_roles = $2`, [req.userId, req.userRol]);
            if (ValidacionRol.rows.length === 1
                && (ValidacionRol.rows[0].rol === 1 || ValidacionRol.rows[0].rol === 10 || ValidacionRol.rows[0].rol === 11)
                && ValidacionRol.rows[0].id === req.userId) {
                next();
                return;
            }
        }
        //No es cliente
        return res.status(401).json({ message: 'Acceso Restringido' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isCliente = isCliente;
