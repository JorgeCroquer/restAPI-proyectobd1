"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiPartMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const cors = require('cors');
const morgan = require('morgan');
const app = express_1.default();
exports.multiPartMiddleware = multipart({ uploadDir: './uploads' });
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
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
