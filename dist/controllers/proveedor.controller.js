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
exports.deleteProveedor = exports.updateProveedor = exports.createProveedor = exports.getProveedores = void 0;
const database_1 = require("../database");
//proveedores
const getProveedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const response: QueryResult = await pool.query('SELECT * FROM proveedor ORDER BY rif_jur');
        const response = yield database_1.LocalPool.query('SELECT * FROM persona_juridica WHERE rif_jur IN (SELECT fk_rif_jur FROM proveedor)');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getProveedores = getProveedores;
const createProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fk_rif_jur, marca_propia } = req.body;
        const response = yield database_1.LocalPool.query('INSERT INTO proveedor VALUES ($1,$2)', [fk_rif_jur, marca_propia]);
        return res.status(201).json({
            message: "Proveedor created successfully",
            body: {
                Proveedor: {
                    fk_rif_jur, marca_propia
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createProveedor = createProveedor;
const updateProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fk_rif_jur, marca_propia } = req.body;
        const response = yield database_1.LocalPool.query('UPDATE proveedor SET marca_propia = $1  WHERE fk_rif_jur = $2', [marca_propia, fk_rif_jur]);
        return res.status(200).json(`Proveedor ${fk_rif_jur} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateProveedor = updateProveedor;
const deleteProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.LocalPool.query('DELETE FROM proveedor WHERE fk_rif_jur = $1', [id]);
        return res.status(200).json(`Proveedor ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deleteProveedor = deleteProveedor;
