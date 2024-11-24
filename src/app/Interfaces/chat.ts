export interface Chat{
        idUserDestinatario: string;
        idUserEmisor: string;
        fechaDeCreacion: Date;
        mensaje: string;
        visto?: boolean;
        eliminadoPor?: {
          idPerfil: string| null;
          fechaDeEliminacion: Date | null;
        }[];
 }