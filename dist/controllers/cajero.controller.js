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
exports.DescontarInventario = exports.QuitarPuntosJur = exports.AgregarPuntosJur = exports.QuitarPuntosNat = exports.AgregarPuntosNat = exports.crearPago = exports.crearPunto = exports.crearEfectivo = exports.crearCuenta = exports.crearTarjeta = exports.crearDineroEle = exports.crearCripto = exports.crearMedio = exports.crearOrdenEstatus = exports.crearProductoOrden = exports.crearOrdenFisico = exports.getDescuentos = exports.getValorPunto = exports.getClientesJur = exports.getClientesNat = exports.getTablaMonedas = exports.getProductosid = exports.getProductos = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//cajero
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`SELECT producto.codigo_pro as codigo,
            producto.nombre_pro as nombre,
            producto.pathimagen_pro as imagen,
            precio.precio_pre as precio 
            FROM producto inner join precio 
            ON producto.codigo_pro = precio.fk_producto 
            `);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getProductos = getProductos;
const getProductosid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield PoolEnUso.query(`SELECT producto.codigo_pro as codigo,
            producto.nombre_pro as nombre,
            producto.pathimagen_pro as imagen,
            precio.precio_pre as precio 
            FROM producto inner join precio 
            ON producto.codigo_pro = precio.fk_producto 
            WHERE producto.codigo_pro = $1`, [id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getProductosid = getProductosid;
const getTablaMonedas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`SELECT tipo_moneda.nombre_tip as moneda,
            historico_moneda.valor_his as valor
            FROM tipo_moneda join historico_moneda 
            ON tipo_moneda.codigo_tip = historico_moneda.fk_tipo_moneda 
            WHERE historico_moneda.fechafin_his is null`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getTablaMonedas = getTablaMonedas;
const getClientesNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`select persona_natural.cedula_nat,
            persona_natural.primernombre_nat,
            persona_natural.primerapellido_nat,
            cliente_nat.puntos_nat
            from cliente_nat join persona_natural
            on persona_natural.cedula_nat=cliente_nat.fk_cedula_nat`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getClientesNat = getClientesNat;
const getClientesJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`select persona_juridica.rif_jur,
            persona_juridica.razonsocial_jur,
            cliente_jur.puntos_jur
            from cliente_jur join persona_juridica
            on persona_juridica.rif_jur=cliente_jur.fk_rif_jur`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getClientesJur = getClientesJur;
const getValorPunto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`select * from valor_punto
            where fechafin_val is null`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getValorPunto = getValorPunto;
const getDescuentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`
            SELECT
            codigo_des as codigo,
            porcentaje_des as porcentaje,
            fk_producto as producto
            FROM descuento
            JOIN promo
            ON promo.codigo_prom=descuento.fk_promo
            WHERE promo.fechafin_des is null OR current_date BETWEEN promo.fechainicio_des AND promo.fechafin_des`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getDescuentos = getDescuentos;
//lo de leo
const crearOrdenFisico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {puntosA,puntosG,valorPunto,sucursal,direcionTextual, id, tipo} = req.body;
        const { PAdquiridos, PGastados, tipo_orden, fk_valor_punto, tipo_cli, Ci_rif, fk_sucursal } = req.body;
        const fecha = new Date().toLocaleDateString('en-US');
        const lugar = yield PoolEnUso.query(`SELECT codigo_lug
             FROM lugar JOIN sucursal ON sucursal.fk_lugar = lugar.codigo_lug
             WHERE sucursal.codigo_suc = $1`, [fk_sucursal]);
        const lugarN = yield PoolEnUso.query(`SELECT nombre_lug
            FROM lugar JOIN sucursal ON sucursal.fk_lugar = lugar.codigo_lug
            WHERE sucursal.codigo_suc = $1`, [fk_sucursal]);
        let parroquia = lugar.rows[0].codigo_lug;
        if (tipo_cli == 'nat') {
            const response = yield PoolEnUso.query(`
            INSERT INTO orden(
                puntosadquiridos_ord,
                puntosgastados_ord,
                fecha_ord,
                tipo_ord,
                fk_valor_punto_ord,
                fk_lugar_ord,
                fk_sucursal,
                fk_cliente_nat,
                direcciontextual_ord)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING numero_ord`, [PAdquiridos, PGastados, fecha, tipo_orden, fk_valor_punto, parroquia, fk_sucursal, Ci_rif, lugarN.rows[0].nombre_lug]);
            return res.status(200).json(response.rows);
            /*
            return res.status(201).json({
                message: "orden created successfully",
                body: {
                    suministro: {
                        PAdquiridos,PGastados,fecha,tipo_orden,fk_valor_punto,parroquia,Ci_rif,lugarN
                    }
                },
                respuesta:response.rows
            });
            */
        }
        else {
            const response = yield PoolEnUso.query(`
            INSERT INTO orden(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
            fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_jur,direcciontextual_ord)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING numero_ord`, [PAdquiridos, PGastados, fecha, tipo_orden, fk_valor_punto, parroquia, fk_sucursal, Ci_rif, lugarN.rows[0].nombre_lug]);
            return res.status(200).json(response.rows); /*
            return res.status(201).json({
                message: "orden created successfully",
                body: {
                    suministro: {
                        PAdquiridos,PGastados,fecha,tipo_orden,fk_valor_punto,parroquia,Ci_rif,lugarN
                    }
                },
                respuesta:response.rows
            });*/
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});
exports.crearOrdenFisico = crearOrdenFisico;
const crearProductoOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cantidad_producto, precio_producto, fk_producto, fk_orden } = req.body;
        console.log('cantidad', cantidad_producto);
        console.log('precio', precio_producto);
        console.log('producto', fk_producto);
        console.log('orden', fk_orden);
        const response = yield PoolEnUso.query(`
        INSERT INTO producto_orden(cantidad_pro_ord,precio_prod_ord,fk_producto_pro_ord,fk_orden_pro_ord)
        VALUES($1,$2,$3,$4)`, [cantidad_producto, precio_producto, fk_producto, fk_orden]);
        return res.status(200).json(response.rows); /*
        return res.status(201).json({
            message: "Relationship Producto_orden created successfully",
            body: {
                Proveedor: {
                    cantidad_producto,precio_producto,fk_producto,fk_orden
                }
            }
        });*/
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearProductoOrden = crearProductoOrden;
const crearOrdenEstatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fecha, fk_orden, fk_status } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO status_orden
        VALUES($1,$2,$3)`, [fecha, fk_orden, fk_status]);
        return res.status(201).json({
            message: " Status_orden created successfully",
            body: {
                Proveedor: {
                    fecha, fk_orden, fk_status
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
const crearMedio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`
        INSERT
        INTO medio_pago
        VALUES(nextval('medio_pago_codigo_med_seq'))
        RETURNING codigo_med`);
        return res.status(200).json(response.rows); /*
        return res.status(201).json({
            message: "Medio de pago successfully created",
            body: {
                Proveedor: {
                }
            },
            respuesta:response.rows //Aquí reguresa el ID que acaba de insertar
        });*/
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearMedio = crearMedio;
const crearCripto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, wallet, tipo } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO criptomoneda
        VALUES ($1,$2,$3)`, [medio, wallet, tipo]);
        return res.status(201).json({
            message: "Medio de pago cripto created successfully",
            body: {
                Proveedor: {
                    medio, wallet, tipo
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearCripto = crearCripto;
const crearDineroEle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, usuario, nombreservicio } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO dinero_electronico
        VALUES($1,$2,$3)`, [medio, usuario, nombreservicio]);
        return res.status(201).json({
            message: "Dinero electronico created successfully",
            body: {
                Proveedor: {
                    medio, usuario, nombreservicio
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearDineroEle = crearDineroEle;
const crearTarjeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, numero, banco, tarjetahabiente, cedula, vencimiento, tipo } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO tarjeta
        VALUES($1,$2,$3,$4,$5,$6,$7)`, [medio, numero, banco, tarjetahabiente, cedula, vencimiento, tipo]);
        return res.status(201).json({
            message: "Tarjeta medio created successfully",
            body: {
                Proveedor: {
                    medio, numero, banco, tarjetahabiente, cedula, vencimiento, tipo
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearTarjeta = crearTarjeta;
const crearCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, numero, banco, tipo, rif_ci } = req.body;
        if (tipo == 'nat') {
            const response = yield PoolEnUso.query(`
            INSERT
            INTO cuenta_bancaria
            VALUES($1,$2,$3,$4,null)`, [medio, numero, banco, parseInt(rif_ci)]);
            return res.status(201).json({
                message: "Medio Cuenta nat created successfully",
                body: {
                    Proveedor: {
                        medio, numero, banco, rif_ci
                    }
                }
            });
        }
        else {
            const response = yield PoolEnUso.query(`
            INSERT
            INTO cuenta_bancaria
            VALUES($1,$2,$3,null,$4)`, [medio, numero, banco, rif_ci]);
            return res.status(201).json({
                message: "Medio Cuenta jur created successfully",
                body: {
                    Proveedor: {
                        medio, numero, banco, rif_ci
                    }
                }
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearCuenta = crearCuenta;
const crearEfectivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, divisa } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO efectivo
        VALUES($1,$2);`, [medio, divisa]);
        return res.status(201).json({
            message: "Medio Efectivo created successfully",
            body: {
                Proveedor: {
                    medio, divisa
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearEfectivo = crearEfectivo;
const crearPunto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, valor } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO punto
        VALUES($1,$2);`, [medio, valor]);
        return res.status(201).json({
            message: "Medio Punto created successfully",
            body: {
                Proveedor: {
                    medio
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearPunto = crearPunto;
const crearPago = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { importe, fk_medio, fk_orden } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO pago (monto_pag,fk_medio_pag,fk_orden_pag)
        VALUES($1,$2,$3)`, [importe, fk_medio, fk_orden]);
        return res.status(201).json({
            message: "Pago created successfully",
            body: {
                Proveedor: {
                    importe, fk_medio, fk_orden
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearPago = crearPago;
const AgregarPuntosNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula, Puntos } = req.body;
        const response = yield PoolEnUso.query(`
        update cliente_nat set puntos_nat= (puntos_nat+$2)
        where fk_cedula_nat=$1`, [cedula, Puntos]);
        return res.status(201).json({
            message: "Puntos anadidos NAT successfully",
            body: {
                Proveedor: { cedula, Puntos }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.AgregarPuntosNat = AgregarPuntosNat;
const QuitarPuntosNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula, Puntos } = req.body;
        const response = yield PoolEnUso.query(`
        update cliente_nat set puntos_nat= (puntos_nat-$2)
        where fk_cedula_nat=$1`, [cedula, Puntos]);
        return res.status(201).json({
            message: "Puntos restados NAT successfully",
            body: {
                Proveedor: { cedula, Puntos }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.QuitarPuntosNat = QuitarPuntosNat;
const AgregarPuntosJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rif, Puntos } = req.body;
        const response = yield PoolEnUso.query(`
        update cliente_jur set puntos_jur= (puntos_jur+$2)
        where fk_rif_jur= $1`, [rif, Puntos]);
        return res.status(201).json({
            message: "Puntos anadidos JUR successfully",
            body: {
                Proveedor: { rif, Puntos }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.AgregarPuntosJur = AgregarPuntosJur;
const QuitarPuntosJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rif, Puntos } = req.body;
        const response = yield PoolEnUso.query(`
        update cliente_jur set puntos_jur= (puntos_jur-$2)
        where fk_rif_jur= $1`, [rif, Puntos]);
        return res.status(201).json({
            message: "Puntos restados JUR successfully",
            body: {
                Proveedor: { rif, Puntos }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.QuitarPuntosJur = QuitarPuntosJur;
const DescontarInventario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fk_sucursal, fk_producto, cantidad } = req.body;
        const a = yield PoolEnUso.query(`
        select producto_seccion.cantidad_pro_sec,
        seccion.codigo_sec,
        producto_seccion.fk_producto
        from producto_seccion join seccion
        on producto_seccion.fk_seccion=seccion.codigo_sec
        join pasillo
        on seccion.fk_pasillo=pasillo.codigo_pas
        where pasillo.fk_sucursal=$1 and producto_seccion.fk_producto =$2
        `, [fk_sucursal, fk_producto]);
        const response = yield PoolEnUso.query(`
        update producto_seccion 
        set cantidad_pro_sec= cantidad_pro_sec-$1
        where fk_seccion=$2 and fk_producto=$3
        `, [cantidad, a.rows[0].codigo_sec, a.rows[0].fk_producto]);
        return res.status(201).json({
            message: "descuento de inventario successfully",
            body: {
                Proveedor: { cantidad, a }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.DescontarInventario = DescontarInventario;
