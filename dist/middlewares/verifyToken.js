"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
