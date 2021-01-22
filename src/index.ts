import express from 'express'
import { Request, Response} from 'express'
import indexRoutes from './routes/index'
import reportRoutes from './routes/reports'
import {QueryResult} from 'pg'
import {pool} from './database'
import {LocalPool} from './database'
import {EmpleadoListo} from './interfaces/EmpleadoListo'
//import EmpleadosListos from '../../restapi-proyecto-ts/EmpleadoListo.json'
import {multiPartMiddleware} from './middlewares/connect-multiparty'


const bodyParser = require ('body-parser');
//const multipart = require ('connect-multiparty');
const cors = require('cors');
const morgan = require('morgan');
const XLSX = require('xlsx');
const axios = require('axios');
const fs = require('fs');

const EmpListos = require('../EmpleadosListos.json')

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
app.use('/api',reportRoutes);







//Se levanta el servidor
app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
})