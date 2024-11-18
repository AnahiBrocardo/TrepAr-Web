export interface ProductoInterface {
    id?: string,
    idUser: string,
    nombre:string,
    categoria: string;
    descripcion: string; 
    precio: string; 
    deletedAt: boolean | null
    privado?: boolean;
}

export interface UsuariosxProductos{
    id?:string, 
    productoInterface: ProductoInterface[]
}
