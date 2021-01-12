"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool2 = exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: 'grupo1bd1',
    host: 'labs-dbservices01.ucab.edu.ve',
    password: '123456789',
    database: 'proyectogrupo1bd1',
    port: 5432
});
exports.pool2 = new pg_1.Pool({
    user: 'jorge',
    host: 'localhost',
    password: '221099',
    database: 'prueba carnet',
    port: 5432
});
