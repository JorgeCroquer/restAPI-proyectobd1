"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const tiendas_1 = __importDefault(require("./routes/tiendas"));
const reports_1 = __importDefault(require("./routes/reports"));
const proveedor_1 = __importDefault(require("./routes/proveedor"));
const cliente_1 = __importDefault(require("./routes/cliente"));
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
// Instancia del servidor
const app = express_1.default();
//export const multiPartMiddleware = multipart({uploadDir: 'src/uploads'})
//settings
app.set('port', process.env.PORT || 3000);
//Middlewares
app.use(morgan('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//Routes
app.use('/api', index_1.default);
app.use('/api', tiendas_1.default);
app.use('/api', reports_1.default);
app.use('/api', proveedor_1.default);
app.use('/api', cliente_1.default);
//Se levanta el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
