export interface ProductoInterface {
    id?:string,
    nombre:string,
    categoria: string;
    descripcion: string; 
    precio: string; 
    deletedAt: boolean
}

export interface UsuariosxProductos{
    id?:string, 
    productoInterface: ProductoInterface[]
}
