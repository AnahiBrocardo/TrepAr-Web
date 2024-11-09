export interface User{
    id?:number,
    email:string,
    password: string;
    nombre?:string,
    apellido?:string,
    createdAt: Date,
    deletedAt: Date | null
}