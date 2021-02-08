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
        const { puntosA, untosG, fecha, Date, tipo, valorPunto, sucursal, clienteId, direcionTextual, id } = req.body;
        console.log(id);
        const response = yield PoolEnUso.query(`
        INSERT 
        INTO ORDEN(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
		   fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_nat,direcciontextual_ord)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING numero_ord`, [puntosA, untosG, fecha, Date, tipo, valorPunto, sucursal, clienteId, direcionTextual]);
        return res.status(201).json({
            message: "orden created successfully",
            body: {
                suministro: {
                    puntosA, untosG, fecha, Date, tipo, valorPunto, sucursal, clienteId, direcionTextual
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
        const { cantidad, precio, producto, orden } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO producto_orden(cantidad_pro_ord,precio_prod_ord,fk_producto_pro_ord,fk_orden_pro_ord)
        VALUES($1,$2,$3,$4)`, [cantidad, precio, producto, orden]);
        return res.status(201).json({
            message: "Relationship Producto_orden created successfully",
            body: {
                Proveedor: {
                    cantidad, precio, producto, orden
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
        const { fecha, orden, estatus } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO status_orden
        VALUES($1,$2,$3)`, [fecha, orden, estatus]);
        return res.status(201).json({
            message: "Relationship Status_orden created successfully",
            body: {
                Proveedor: {
                    fecha, orden
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
