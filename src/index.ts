import express from 'express'
import indexRoutes from './routes/index'
import tiendasRoutes from './routes/tiendas'
import reportRoutes from './routes/reports'
import proveedoresRoutes from './routes/proveedor'
import clientesRoutes from './routes/cliente'


const bodyParser = require ('body-parser');
const cors = require('cors');
const morgan = require('morgan');


// Instancia del servidor
const app = express();

//export const multiPartMiddleware = multipart({uploadDir: 'src/uploads'})



//settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

//Routes
app.use('/api',indexRoutes);
app.use('/api',tiendasRoutes);
app.use('/api',reportRoutes);
app.use('/api',proveedoresRoutes);
app.use('/api',clientesRoutes);




//Se levanta el servidor
app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
})