const multipart = require ('connect-multiparty');

export const multiPartMiddleware = multipart({uploadDir: 'src/uploads'})