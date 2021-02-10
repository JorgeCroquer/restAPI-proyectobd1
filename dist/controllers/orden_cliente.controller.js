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
exports.getValorPunto = exports.crearOrdenEstatus = exports.crearProductoOrden = exports.crearOrden = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
const crearOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { puntosA, untosG, fecha, tipo, valorPunto, lugardir, sucursal, direcionTextual } = req.body;
        const userId = req.userId;
        const tipoCli = yield PoolEnUso.query(`SELECT fk_persona_nat, fk_persona_jur
             FROM usuarios 
             WHERE codigo_usu =$1`, [userId]);
        let tipocliente;
        if (tipoCli.rows[0].fk_persona_nat) {
            tipocliente = 'nat';
        }
        else {
            tipocliente = 'jur';
        }
        const persona = yield PoolEnUso.query(`SELECT pn.cedula_nat::varchar(12) AS id
             FROM persona_natural pn JOIN usuarios u ON pn.cedula_nat = u.fk_persona_nat
             WHERE codigo_usu = $1
             UNION
             SELECT pj.rif_jur AS id
             FROM persona_juridica pj JOIN usuarios u ON pj.rif_jur = u.fk_persona_jur
             WHERE codigo_usu = $1`, [userId]);
        let id = persona.rows[0].id;
        let puntos;
        if (untosG == null) {
            puntos = 0;
        }
        else {
            puntos = untosG;
        }
        console.log(id);
        if (tipocliente == 'nat') {
            console.log('natural');
            const response = yield PoolEnUso.query(`
            INSERT 
            INTO ORDEN(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
            fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_nat,direcciontextual_ord)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING numero_ord`, [puntosA, puntos, fecha, tipo, valorPunto, lugardir, sucursal, id, direcionTextual]);
            return res.status(201).json({
                message: "orden created successfully",
                body: {
                    suministro: {
                        puntosA, puntos, fecha, Date, tipo, valorPunto, sucursal, userId, direcionTextual
                    }
                },
                respuesta: response.rows
            });
        }
        else if (tipocliente == 'jur') {
            console.log('juridico');
            const response = yield PoolEnUso.query(`
            INSERT 
            INTO ORDEN(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
            fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_jur,direcciontextual_ord)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING numero_ord`, [puntosA, puntos, fecha, tipo, valorPunto, lugardir, sucursal, id, direcionTextual]);
            return res.status(201).json({
                message: "orden created successfully",
                body: {
                    suministro: {
                        puntosA, puntos, fecha, Date, tipo, valorPunto, sucursal, userId, direcionTextual
                    }
                },
                respuesta: response.rows
            });
        }
        return res.status(500).json({ message: "Error muy raro" });
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
const getValorPunto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`
        SELECT codigo_val
        FROM valor_punto
        WHERE fechainicio_val = (SELECT MAX(fechainicio_val) FROM valor_punto)`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getValorPunto = getValorPunto;
