"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PromosCtrl = __importStar(require("../controllers/promo.controller"));
const middlewares_1 = require("../middlewares");
const router = express_1.default();
router.get('/promos', [middlewares_1.authJWT.verifyToken, middlewares_1.authJWT.isGerentePromos], PromosCtrl.getPromosSinNotimart);
router.get('/promos/:id', [middlewares_1.authJWT.verifyToken, middlewares_1.authJWT.isGerentePromos], PromosCtrl.getProductosDePromo);
router.delete('/promos/:id', [middlewares_1.authJWT.verifyToken, middlewares_1.authJWT.isGerentePromos], PromosCtrl.deletePromo);
router.delete('/promos/descuentos/:id', [middlewares_1.authJWT.verifyToken, middlewares_1.authJWT.isGerentePromos], PromosCtrl.deleteProducto);
router.post('/promos', [middlewares_1.authJWT.verifyToken, middlewares_1.authJWT.isGerentePromos], PromosCtrl.createPromo);
router.put('/promos/:id', [middlewares_1.authJWT.verifyToken, middlewares_1.authJWT.isGerentePromos], PromosCtrl.updatePromo);
exports.default = router;
