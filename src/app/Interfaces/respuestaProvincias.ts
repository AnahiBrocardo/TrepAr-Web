import { Provincia } from "./provincia.interface";

export interface RespuestaProvincias {
    cantidad: number;
    inicio: number;
    parametros: object;
    provincias: Provincia[];
  }