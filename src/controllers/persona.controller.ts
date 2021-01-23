import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'

//Aqui se pone la BD que esta en uso
const PoolEnUso = LocalPool


//personas naturales
export const getPersonasNat = async(req: Request,res: Response): Promise<Response> => {
    try{
        const response: QueryResult = await PoolEnUso.query(`SELECT cedula_nat AS cedula,
                                                                    coalesce(rif_nat, 'Sin RIF') AS rif,
                                                                    concat(primernombre_nat,' ',segundonombre_nat) AS nombres,
                                                                    concat(primerapellido_nat,' ', segundoapellido_nat) AS apellidos,
                                                                    fecharegistro_nat AS fecha_registro,
                                                                    coalesce(fk_persona_contacto, 'No es Persona de Contacto') AS persona_contacto,
                                                                    fk_lugar_residencia AS residencia
                                                             FROM persona_natural`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
export const getPersonaNatById = async(req: Request,res: Response): Promise<Response> => {
    try{
        const cedula_nat = req.params.id
        const response: QueryResult = await PoolEnUso.query(`SELECT cedula_nat AS cedula,
                                                                    coalesce(rif_nat, 'Sin RIF') AS rif,
                                                                    concat(primernombre_nat,' ',segundonombre_nat) AS nombres,
                                                                    concat(primerapellido_nat,' ', segundoapellido_nat) AS apellidos,
                                                                    fecharegistro_nat AS fecha_registro,
                                                                    coalesce(fk_persona_contacto, 'No es Persona de Contacto'),
                                                                    fk_lugar_residencia AS residencia
                                                             FROM persona_natural
                                                             WHERE cedula_nat = $1`, [cedula_nat]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
export const createPersonaNat = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia} = req.body;
        const response: QueryResult = await PoolEnUso.query(`INSERT INTO persona_natural 
                                                             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,[cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia]);
        return res.status(201).json({
            message: "Persona Natural created successfully",
            body: {
                Persona: {
                    cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
export const updatePersonaNat = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const cedula_nat = req.params.id;
        const {rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia} = req.body;
        const response: QueryResult = await PoolEnUso.query(`UPDATE persona_natural 
                                                             SET rif_nat = $2,
                                                                 primernombre_nat = $3,
                                                                 segundonombre_nat = $4,
                                                                 primerapellido_nat = $5,
                                                                 segundoapellido_nat = $6,
                                                                 fecharegistro_nat = $7,
                                                                 fk_persona_contacto = $8,
                                                                 fk_lugar_residencia = $9
                                                             WHERE cedula_nat = $1`, [cedula_nat,rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia]);
        return res.status(200).json(`Persona ${cedula_nat} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
export const deletePersonaNat = async(req: Request,res: Response): Promise<Response> => {
    try{
        const cedula_nat = req.params.id;
        const response: QueryResult = await PoolEnUso.query('DELETE FROM persona_natural WHERE cedula_nat = $1', [cedula_nat]);
        return res.status(200).json(`Persona ${cedula_nat} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

//personas juridicas
export const getPersonaJur = async(req: Request,res: Response): Promise<Response> => {
    try{
        const response: QueryResult = await PoolEnUso.query(`SELECT rif_jur AS rif,
                                                                    razonsocial_jur AS razon_social,
                                                                    dencomercial_jur AS denom_comercial,
                                                                    web_jur AS web,
                                                                    capital_jur AS capital,
                                                                    fecharegistro_jur AS fecha_registro,
                                                                    registrofisico_jur AS registro_fisico,
                                                                    fk_direccion_fisica_jur AS direccion_fisica,
                                                                    fk_direccion_fiscal_jur AS direccion_fiscal
                                                             FROM persona_juridica`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getPersonaJurById = async(req: Request,res: Response): Promise<Response> => {
    try{
        const rif_jur = req.params.id
        const response: QueryResult = await PoolEnUso.query(`SELECT rif_jur AS rif,
                                                                    razonsocial_jur AS razon_social,
                                                                    dencomercial_jur AS denom_comercial,
                                                                    web_jur AS web,
                                                                    capital_jur AS capital,
                                                                    fecharegistro_jur AS fecha_registro,
                                                                    registrofisico_jur AS registro_fisico,
                                                                    fk_direccion_fisica_jur AS direccion_fisica,
                                                                    fk_direccion_fiscal_jur AS direccion_fiscal
                                                             FROM persona_juridica
                                                             WHERE rif_jur = $1`, [rif_jur]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createPersonaJur = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {rif,razon_social,denom_comercial,web,capital,fecha_registro,registro_fisico, direccion_fisica, direccion_fiscal} = req.body;
        const response: QueryResult = await PoolEnUso.query(`INSERT INTO persona_juridica (rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur,fk_direccion_fisica_jur, fk_direccion_fiscal_jur) 
                                                             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,[rif,razon_social,denom_comercial,web,capital,fecha_registro,registro_fisico, direccion_fisica, direccion_fiscal]);
        return res.status(201).json({
            message: "Persona Jurídica created successfully",
            body: {
                Persona: {
                    rif,razon_social,denom_comercial,web,capital,fecha_registro,registro_fisico, direccion_fisica, direccion_fiscal
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updatePersonaJur = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const rif_jur = req.params.id;
        const {razon_social,denom_comercial,web,capital,fecha_registro,registro_fisico, direccion_fisica, direccion_fiscal} = req.body;
        const response: QueryResult = await PoolEnUso.query(`UPDATE persona_juridica 
                                                             SET razonsocial_jur = $2,
                                                                 dencomercial_jur = $3,
                                                                 web_jur = $4,
                                                                 capital_jur = $5,
                                                                 fecharegistro_jur = $6,
                                                                 registrofisico_jur = $7,
                                                                 fk_direccion_fisica_jur = $8,
                                                                 fk_direccion_fiscal_jur = $9
                                                             WHERE rif_jur = $1`, [rif_jur,razon_social,denom_comercial,web,capital,fecha_registro,registro_fisico, direccion_fisica, direccion_fiscal]);
        return res.status(200).json(`Persona ${rif_jur} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deletePersonaJur = async(req: Request,res: Response): Promise<Response> => {
    try{
        const rif_jur = req.params.id;
        const response: QueryResult = await PoolEnUso.query('DELETE FROM persona_juridica WHERE rif_jur = $1', [rif_jur]);
        return res.status(200).json(`Persona ${rif_jur} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}