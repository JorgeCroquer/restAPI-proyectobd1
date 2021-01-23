"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const empleado_1 = __importDefault(require("./routes/empleado"));
const tiendas_1 = __importDefault(require("./routes/tiendas"));
const reports_1 = __importDefault(require("./routes/reports"));
const proveedor_1 = __importDefault(require("./routes/proveedor"));
const cliente_1 = __importDefault(require("./routes/cliente"));
const lugar_1 = __importDefault(require("./routes/lugar"));
const persona_1 = __importDefault(require("./routes/persona"));
const app = express_1.default();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
//Settings
app.set('port', process.env.PORT || 3000);
//Middlewares
app.use(morgan('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//Routes
app.use('/api', empleado_1.default);
app.use('/api', tiendas_1.default);
app.use('/api', reports_1.default);
app.use('/api', proveedor_1.default);
app.use('/api', cliente_1.default);
app.use('/api', lugar_1.default);
app.use('/api', persona_1.default);
exports.default = app;
