"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: 'grupo1bd1',
    host: 'labs-dbservices01.ucab.edu.ve',
    password: '123456789',
    database: 'proyectocck',
    port: 5432
});
