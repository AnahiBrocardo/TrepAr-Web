export interface ProductoInterface {
    id?: string,
    idUser: string,
    nombre:string,
    categoria: string;
    descripcion: string; 
    precio: string; 
    deletedAt: boolean | null
}

export interface UsuariosxProductos{
    id?:string, 
    productoInterface: ProductoInterface[]
}
