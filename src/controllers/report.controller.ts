import {Request, Response} from 'express'

export const receivexlsx = async(req: Request,res: Response) =>{
    res.json({
        "message": "File received"
    });
}