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
const PersonaCtrl = __importStar(require("../controllers/persona.controller"));
const router = express_1.default();
//Personas naturales
router.get('/personas/naturales', PersonaCtrl.getPersonasNat);
router.get('/personas/naturales/:id', PersonaCtrl.getPersonaNatById);
router.post('/personas/naturales', PersonaCtrl.createPersonaNat);
router.put('/personas/naturales/:id', PersonaCtrl.updatePersonaNat);
router.delete('/personas/naturales/:id', PersonaCtrl.deletePersonaNat);
//Personas juridicas
router.get('/personas/juridicas', PersonaCtrl.getPersonaJur);
router.get('/personas/juridicas/:id', PersonaCtrl.getPersonaJurById);
router.post('/personas/juridicas', PersonaCtrl.createPersonaJur);
router.put('/personas/juridicas/:id', PersonaCtrl.updatePersonaJur);
router.delete('/personas/juridicas/:id', PersonaCtrl.deletePersonaJur);
exports.default = router;
