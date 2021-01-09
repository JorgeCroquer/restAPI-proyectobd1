import {Request, Response} from 'express'
import {pool} from '../database'
import {QueryResult} from 'pg'

export const getTiendas = async(req: Request, res: Response) =>{
    res.send('entre')
}