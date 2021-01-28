import dotenv from 'dotenv'
dotenv.config();

import app from './app'


//Se levanta el servidor
app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
})