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
exports.crearOrdenEstatus = exports.crearProductoOrden = exports.crearOrden = exports.getOrdenRecien = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//Tiendas
const getOrdenRecien = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fecha, sucursal, proveedor } = req.body;
        const response = yield PoolEnUso.query(`
        SELECT numero_sum
        FROM suministro
        WHERE fecha_sum = $1
        AND fk_sucursal_sum = $2
        AND fk_proveedor_sum = $3`, [fecha, sucursal, proveedor]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getOrdenRecien = getOrdenRecien;
const crearOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fecha, sucursal, proveedor } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT 
        INTO suministro(fecha_sum,fk_sucursal_sum,fk_proveedor_sum)
        VALUES($1,$2,$3)`, [fecha, sucursal, proveedor]);
        return res.status(201).json({
            message: "orden created successfully",
            body: {
                Proveedor: {
                    fecha, sucursal, proveedor
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearOrden = crearOrden;
const crearProductoOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cantidad, pedido, producto } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT 
        INTO producto_suministro
        VALUES($1,$2,$3)`, [cantidad, pedido, producto]);
        return res.status(201).json({
            message: "Relationship Producto_orden created successfully",
            body: {
                Proveedor: {
                    cantidad, pedido, producto
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearProductoOrden = crearProductoOrden;
const crearOrdenEstatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fecha, estatus, pedido } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT 
        INTO suministro_estatus
        VALUES($1,$2,$3)`, [fecha, estatus, pedido]);
        return res.status(201).json({
            message: "Relationship Status_orden  created successfully",
            body: {
                Proveedor: {
                    fecha, estatus, pedido
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearOrdenEstatus = crearOrdenEstatus;
