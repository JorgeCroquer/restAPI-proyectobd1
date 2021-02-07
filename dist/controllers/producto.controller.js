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
exports.getProductosBasic = exports.getBusqueda = exports.getFaltantes = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//Tiendas
const getFaltantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield PoolEnUso.query(`
        SELECT  pr.nombre_pro as Producto, pr.codigo_pro as Producto_codigo, (pz.cantidad_pro_zon + ps.cantidad_pro_sec) as Existencia,jur.rif_jur as Rif_proveedor, jur.dencomercial_jur as Proveedor,
        CASE 
            WHEN EXISTS (SELECT pr.nombre_pro, su.numero_sum 
                        FROM  producto_suministro psu, suministro su, suministro_estatus ss 
                        WHERE pr.codigo_pro = psu.fk_producto_pro_sum 
                        AND psu.fk_pedido_pro_sum = su.numero_sum 
                        AND su.numero_sum = ss.fk_suministro 
                        AND ss.fk_estatus = 2 AND su.fk_sucursal_sum = $1) THEN TRUE 
            ELSE FALSE 
        END AS Orden_Realizada 
        FROM producto pr, producto_zona pz,zona_almacen za,sucursal s, producto_seccion ps, seccion se, pasillo pa, proveedor pro, persona_juridica jur 
        WHERE pr.codigo_pro = pz.fk_producto 
        AND pz.fk_zona_pro = za.codigo_zon 
        AND za.fk_sucursal = s.codigo_suc 
        AND pr.codigo_pro = ps.fk_producto 
        AND ps.fk_seccion = se.codigo_sec 
        AND se.fk_pasillo = pa.codigo_pas 
        AND pa.fk_sucursal = s.codigo_suc 
        AND pr.fk_proveedor_pro = pro.fk_rif_jur 
        AND pro.fk_rif_jur = jur.rif_jur 
        AND s.codigo_suc = $1 
        AND (pz.cantidad_pro_zon + ps.cantidad_pro_sec) <= 100;`, [id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getFaltantes = getFaltantes;
const getBusqueda = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {fecha,sucursal,proveedor,producto} = req.body;
        const sucursal = parseInt(req.params.sucursal);
        const busqueda = '%' + req.params.busqueda + '%';
        const response = yield PoolEnUso.query(`
        SELECT pr.codigo_pro codigo, pr.nombre_pro nombre, pr.pathimagen_pro as ruta, pre.precio_pre as precio
        FROM producto pr, precio pre
        WHERE lower(pr.nombre_pro) LIKE $1
        AND pre.fk_producto = pr.codigo_pro
        AND fecha_pre = (SELECT MAX(fecha_pre)
				        FROM precio pre2
				        WHERE pre2.fk_producto = pr.codigo_pro)
        AND EXISTS (SELECT *
		   	        FROM producto_zona pz, zona_almacen za, sucursal su
		   	        WHERE  pr.codigo_pro = pz.fk_producto
		   	        AND pz.fk_zona_pro = za.codigo_zon
		   	        AND za.fk_sucursal = su.codigo_suc
		   	        AND su.codigo_suc = $2)
        ORDER BY pr.nombre_pro`, [busqueda, sucursal]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getBusqueda = getBusqueda;
const getProductosBasic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield PoolEnUso.query(`SELECT codigo_pro AS id, nombre_pro AS nombre
             FROM producto
             ORDER by nombre DESC`);
        res.status(200).json(productos.rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});
exports.getProductosBasic = getProductosBasic;
