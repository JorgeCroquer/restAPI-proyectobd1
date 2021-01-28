//Esto es para agregarle propiedades a las interfaces aqui puestas
//ya que TypeScript es estricto con las declaraciones

declare namespace Express{
    export interface Request{
        userId: number;
        userRol: number
    }
}