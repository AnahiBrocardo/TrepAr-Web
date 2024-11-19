export interface Perfil{
    id?:string,
    idUser:string,
    userName:string,
    descripcion:string,
    provincia: string;
    ciudad:string,
    linkInstagram:string,
    linkLinkedIn: string,
    linkWeb: string,
    telefono: string,
    listaFavoritos?:string [],
    imagePerfil?: string
}