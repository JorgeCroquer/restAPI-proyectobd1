import { Pool } from 'pg'

export const pool = new Pool ({
    user: 'grupo1bd1',
    host: 'labs-dbservices01.ucab.edu.ve',
    password: '123456789',
    database: 'proyectogrupo1',
    port: 5432
});

export const pool2 = new Pool ({
    user: 'jorge',
    host: 'localhost',
    password: '221099',
    database: 'prueba carnet',
    port: 5432
})


