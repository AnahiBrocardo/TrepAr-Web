import { GastoFijo } from './GastoFijo.interface';
import { MateriaPrima } from './MateriaPrima.interface';
export interface Simulador{
    id: string,
    idUsuario: string,
    nombre: string,
    precioMP: number,
    cantidadMP: number,
    UnidadDeCompraMP: number
    valorGF: number
    CantidadProductoMensual: number,
    Ganancia: number,
    PrecioFinal: number,
    habilitado: boolean
}
