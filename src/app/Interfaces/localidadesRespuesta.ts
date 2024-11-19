import { Localidad } from "./localidad";

export interface LocalidadesResponse {
    cantidad: number;
    inicio: number;
    localidades: Localidad[]; // Array de objetos `Localidad`
    parametros: {
      campos: string[];
      max: number;
      provincia: string[];
    };
    total: number;
  }