import { Pool } from 'pg'

export const pool = new Pool ({
    user: 'grupo1bd1',
    host: 'labs-dbservices01.ucab.edu.ve',
    password: '123456789',
    database: 'proyectocck',
    port: 5432
})
