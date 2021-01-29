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
exports.getFaltantes = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//Tiendas
const getFaltantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield PoolEnUso.query('SELECT  pr.nombre_pro as Producto, s.nombre_suc as Sucursal, (pz.cantidad_pro_zon + ps.cantidad_pro_sec) as Existencia FROM producto pr, producto_zona pz,zona_almacen za,sucursal s, producto_seccion ps, seccion se, pasillo pa WHERE pr.codigo_pro = pz.fk_producto AND	pz.fk_zona_pro = za.codigo_zon AND za.fk_sucursal = s.codigo_suc AND pr.codigo_pro = ps.fk_producto AND ps.fk_seccion = se.codigo_sec AND se.fk_pasillo = pa.codigo_pas AND pa.fk_sucursal = s.codigo_suc AND s.codigo_suc = $1 AND (pz.cantidad_pro_zon + ps.cantidad_pro_sec) <= 100', [id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getFaltantes = getFaltantes;
// export const updateTienda = async(req: Request, res: Response): Promise<Response> =>{
//     try{
//         const id = parseInt(req.params.id);
//         const {nombre} = req.body;
//         const response: QueryResult = await PoolEnUso.query('UPDATE sucursal SET nombre_suc = $1 WHERE codigo_suc = $2', [nombre,id]);
//         return res.status(202).json(`Tienda ${id} updated successfully`);
//     }
//     catch(e){
//         console.log(e);
//         return res.status(500).send('Internal Server Error');
//     }
// }
// export const deleteTienda = async(req: Request,res: Response): Promise<Response> => {
//     try{
//         const id = parseInt(req.params.id);
//         const response: QueryResult = await PoolEnUso.query('DELETE FROM sucursal WHERE codigo_suc = $1', [id]);
//         return res.status(200).json(`tienda ${id} deleted successfully`);
//     }
//     catch(e){
//         console.log(e);
//         return res.status(500).send('Internal Server Error');
//     }
// }
// export const createTienda = async(req: Request,res: Response): Promise<Response> => {
//     try{
//         const{nombre,codigo_dir} = req.body
//         const response: QueryResult = await PoolEnUso.query('INSERT INTO sucursal(nombre_suc,fk_lugar) VALUES ($1,$2)', [nombre,codigo_dir]);
//         return res.status(201).json({
//             message: "Sucursal created successfully",
//             body: {
//                 sucursal: {
//                     nombre,
//                     codigo_dir
//                 }
//             }
//         });
//     }
//     catch(e){
//         console.log(e);
//         return res.status(500).send('Internal Server Error');
//     }
// }