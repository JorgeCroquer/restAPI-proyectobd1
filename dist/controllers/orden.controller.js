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
exports.crearOrdenEstatus = exports.crearProductoOrden = exports.crearOrden = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
const crearOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fecha, sucursal, proveedor } = req.body;
        console.log(proveedor);
        const response = yield PoolEnUso.query(`
        INSERT 
        INTO suministro(fecha_sum,fk_sucursal_sum,fk_proveedor_sum)
        VALUES($1,$2,$3)
        RETURNING numero_sum;`, [fecha, sucursal, proveedor]);
        return res.status(201).json({
            message: "orden created successfully",
            body: {
                suministro: {
                    fecha, sucursal, proveedor,
                }
            },
            respuesta: response.rows
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
        const { fecha, pedido } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT 
        INTO suministro_estatus
        VALUES($1,2,$2)`, [fecha, pedido]);
        return res.status(201).json({
            message: "Relationship Status_orden  created successfully",
            body: {
                Proveedor: {
                    fecha, pedido
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
