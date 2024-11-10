export interface User{
    id?:string,
    email:string,
    password: string;
    nombre?:string,
    apellido?:string,
    createdAt?: Date,
    deletedAt?: Date | null
}