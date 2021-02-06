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
exports.reponer = exports.getAlertas = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
const getAlertas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sucursal = req.params.id;
        const alertas = yield PoolEnUso.query(`SELECT pr.codigo_pro AS id_prod,ps.fk_seccion AS id_sec , pr.nombre_pro AS nombre, current_date AS fecha, p.numero_pas AS pasillo, split_part(s.nombre_sec, ' ', 2) AS seccion
             FROM producto pr JOIN producto_seccion ps ON pr.codigo_pro = ps.fk_producto
                JOIN seccion s ON ps.fk_seccion = s.codigo_sec
                JOIN pasillo p ON s.fk_pasillo = p.codigo_pas
                JOIN sucursal s2 on p.fk_sucursal = s2.codigo_suc
            WHERE codigo_suc = $1 AND ps.cantidad_pro_sec <= 10;`, [sucursal]);
        return res.status(200).json(alertas.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getAlertas = getAlertas;
const reponer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cantidad, id_prod, id_sec } = req.body;
        console.log(cantidad);
        console.log(id_prod);
        console.log(id_sec);
        const DescuentoAlmacen = yield PoolEnUso.query(`UPDATE producto_zona SET cantidad_pro_zon = cantidad_pro_zon-($1)
            WHERE fk_producto = $2
                  AND fk_zona_pro IN (SELECT za.codigo_zon
                                      FROM zona_almacen za JOIN sucursal s ON za.fk_sucursal = s.codigo_suc
                                            JOIN pasillo p ON s.codigo_suc = p.fk_sucursal
                                            JOIN seccion sec on p.codigo_pas = sec.fk_pasillo
                                      WHERE sec.codigo_sec = $3)`, [cantidad, id_prod, id_sec]);
        const SumaSeccion = yield PoolEnUso.query(`UPDATE producto_seccion SET cantidad_pro_sec = cantidad_pro_sec+($1)
            WHERE fk_producto = $2 AND fk_seccion = $3`, [cantidad, id_prod, id_sec]);
        return res.status(200).json({ message: 'Reposicion confirmada' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});
exports.reponer = reponer;
