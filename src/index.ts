import express from 'express';
import indexRoutes from './routes/index'
const app = express();
const morgan = require('morgan');


//settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Routes
app.use('/api',indexRoutes);


app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
})