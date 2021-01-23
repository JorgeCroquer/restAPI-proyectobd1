import express from 'express'
import empleadosRoutes from './routes/empleado'
import tiendasRoutes from './routes/tiendas'
import reportRoutes from './routes/reports'
import proveedoresRoutes from './routes/proveedor'
import clientesRoutes from './routes/cliente'
import lugaresRoutes from './routes/lugar'
import personasRoutes from './routes/persona'

const app = express();



const bodyParser = require ('body-parser');
const cors = require('cors');
const morgan = require('morgan');


//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

//Routes
app.use('/api',empleadosRoutes);
app.use('/api',tiendasRoutes);
app.use('/api',reportRoutes);
app.use('/api',proveedoresRoutes);
app.use('/api',clientesRoutes);
app.use('/api',lugaresRoutes);
app.use('/api',personasRoutes);



export default app;