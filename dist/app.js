"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const empleado_routes_1 = __importDefault(require("./routes/empleado.routes"));
const tiendas_routes_1 = __importDefault(require("./routes/tiendas.routes"));
const reports_routes_1 = __importDefault(require("./routes/reports.routes"));
const proveedor_routes_1 = __importDefault(require("./routes/proveedor.routes"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
const lugar_routes_1 = __importDefault(require("./routes/lugar.routes"));
const persona_routes_1 = __importDefault(require("./routes/persona.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const orden_routes_1 = __importDefault(require("./routes/orden.routes"));
const notimart_routes_1 = __importDefault(require("./routes/notimart.routes"));
const promos_routes_1 = __importDefault(require("./routes/promos.routes"));
const pasillo_routes_1 = __importDefault(require("./routes/pasillo.routes"));
const cajero_routes_1 = __importDefault(require("./routes/cajero.routes"));
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
app.use('/api', empleado_routes_1.default);
app.use('/api', tiendas_routes_1.default);
app.use('/api', reports_routes_1.default);
app.use('/api', proveedor_routes_1.default);
app.use('/api', cliente_routes_1.default);
app.use('/api', lugar_routes_1.default);
app.use('/api', persona_routes_1.default);
app.use('/api', auth_routes_1.default);
app.use('/api', productos_routes_1.default);
app.use('/api', orden_routes_1.default);
app.use('/api', notimart_routes_1.default);
app.use('/api', promos_routes_1.default);
app.use('/api', pasillo_routes_1.default);
app.use('/api', cajero_routes_1.default);
exports.default = app;
