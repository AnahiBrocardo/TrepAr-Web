export interface Chat{
        idUserDestinatario: string;
        idUserEmisor: string;
        fechaDeCreacion: Date;
        mensaje: string;
        visto?: boolean;
        eliminadoPor?: {
          idPerfil: string;
          fechaDeEliminacion: Date | null;
        }[];
 }