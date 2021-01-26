import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'
import bcrypt from 'bcrypt'
import {persona_natural} from '../Clases/persona_natural'
import {persona_juridica} from '../Clases/persona_juridica'
import {QR} from '../Clases/QR'
import {usuario} from '../Clases/usuario'
import jwt from 'jsonwebtoken'
//import * as config from '../config/config'

const PoolEnUso = LocalPool;


//Funcion para encriptar un password
async function encryptPassword(password:string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
}
async function comparePasswords(encryptedPassword: string, password:string): Promise<boolean>{
    console.log(encryptedPassword)
    return await bcrypt.compare(password, encryptedPassword)
}


function createToken(id: string, rol: number): string{
    return jwt.sign({id: id, rol: rol}, process.env.JWT_Secret || 'somesecrettoken', {expiresIn: 86400 /*24 horas*/})
}

export const signUp = async (req: Request,res: Response) =>{
    try {

        //hay que obtener todo lo necesario para insertar una persona y su usuario
    const {tipo,
        user,email,password,rol,
        cedula, rif, primernombre,segundonombre, primerapellido,segundoapellido, persona_contacto, codigo_residencia,
        razon_social, denom_comercial, web, capital, direccion_fisica, direccion_fiscal} = req.body;

        
    //Una mini validacion
    if (!email || !password || !user){
        res.status(400).json({message: 'Faltan campos'})
        return;
    }

    //Verificamos que el usuario no exista 
    var newUser = new usuario(user, email, password, [rol])
    
    if (await newUser.existeEnBD()){
        res.status(400).json({message: 'Ya existe un usuario con ese nombre o esa direccion e-mail'})  
        return;     
    }

     //Se encripta el password
    const encryptedPassword = await encryptPassword(password);

    switch (tipo){
        case 'nat':{

            //Verificamos que no exista esa persona natural
            var newPersonaNat: persona_natural = new persona_natural(cedula,rif,primernombre,segundonombre,primerapellido,segundoapellido,persona_contacto,codigo_residencia);
            if (await newPersonaNat.existeEnBD()){
                res.status(400).json({message: `La persona con cedula ${cedula} ya esta registrada`});
                return;
            }

            //Insertamos la persona natural
            const InsercionNat: QueryResult = await PoolEnUso.query(`INSERT INTO persona_natural 
                                                                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [cedula,rif,primernombre,segundonombre,primerapellido,segundoapellido,new Date(),persona_contacto,codigo_residencia]);

            //Generamos el QR del nuevo cliente
            await QR.generarQR(cedula, `http://localhost:3000/api/clientes/naturales/${cedula}`);

            //Insertamos al cliente
            const InsercionCli: QueryResult = await PoolEnUso.query(`INSERT INTO cliente_nat 
                                                                    VALUES ($1,$2,$3,$4,$5)`, [cedula,false,0,1,`C:\\ImagenesBD\\QR\\${cedula}.png`]);

            //ahora si creamo el usuario
            const InsercionUser: QueryResult = await PoolEnUso.query(`INSERT INTO usuarios (nombre_usu, password_usu, direccion_ema, fk_roles,fk_persona_nat) 
                                                                    VALUES ($1,$2,$3,$4,$5)`, [user,encryptedPassword,email,rol,cedula]);

         res.status(201).json({message: `El usuario ${user} fue registrado exitosamente`})
        }
        case 'jur':{

             //Verificamos que no exista esa persona juridica
            var newPersonaJur: persona_juridica = new persona_juridica(rif,razon_social,denom_comercial, web,capital, direccion_fisica,direccion_fiscal)
            if (await newPersonaJur.existeEnBD()){
                res.status(400).json({message: `La persona con RIF ${rif} ya esta registrada`});
                return;
            }

            //Insertamos la persona natural
            const InsercionNat: QueryResult = await PoolEnUso.query(`INSERT INTO persona_juridica 
                                                                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [rif,razon_social,denom_comercial, web,capital,new Date(), direccion_fisica,direccion_fiscal]);
            
            //Generamos el QR del nuevo cliente
            await QR.generarQR(rif, `http://localhost:3000/api/clientes/juridicos/${rif}`);

            //Insertamos al cliente
            const InsercionCli: QueryResult = await PoolEnUso.query(`INSERT INTO cliente_jur 
                                                                    VALUES ($1,$2,$3,$4,$5)`, [rif,0,1,false,`C:\\ImagenesBD\\QR\\${rif}.png`]);

            //ahora si creamos el usuario
            const InsercionUser: QueryResult = await PoolEnUso.query(`INSERT INTO usuarios (nombre_usu, password_usu, direccion_ema, fk_roles,fk_persona_jur) 
                                                                    VALUES ($1,$2,$3,$4,$5)`, [user,encryptedPassword,email,rol,rif]);

         res.status(201).json({message: `El usuario ${user} fue registrado exitosamente`})
        }




    }
        
    } catch (error) {
        console.log(error);
    }

    
   
    

}

export const logIn = async(req: Request,res: Response) =>{
    try {
        const {email, password} = req.body
        //Una mini validacion
        if (!email || !password){
            res.status(400).json({message: 'Faltan campos'})
            return;
        }
        //Verifiquemos si el usuario existe
        const response: QueryResult = await PoolEnUso.query(`SELECT codigo_usu AS ID,nombre_usu AS username,direccion_ema AS email, password_usu AS encryptedpassword, fk_roles AS rol 
                                                            FROM usuarios
                                                           WHERE direccion_ema = $1`, [email]);
        if (response.rows.length != 1){
            res.status(400).json({message: `No hay una cuenta asociada a la direccion ${email}`})
            return
        }
        var usuario = response.rows[0];
        if (await comparePasswords(usuario.encryptedpassword, password) == false){
            res.status(400).json({message: 'Direccion de e-mail o contraseña invalidos'})
            return;
        }
        res.header('auth-token', createToken(usuario.id, usuario.rol))
        res.status(200).json({message: 'Sesion iniciada correctamente'})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}