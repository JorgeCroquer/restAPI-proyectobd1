"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiPartMiddleware = void 0;
const multipart = require('connect-multiparty');
exports.multiPartMiddleware = multipart({ uploadDir: 'src/uploads' });
