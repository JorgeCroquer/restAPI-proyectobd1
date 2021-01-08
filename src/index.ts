import express from 'express';
import indexRoutes from './routes/index'

const bodyParser = require ('body-parser');
const multipart = require ('connect-multiparty');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

export const multiPartMiddleware = multipart({uploadDir: './uploads'})

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


app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
})