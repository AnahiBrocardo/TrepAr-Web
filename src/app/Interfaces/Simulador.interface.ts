import { GastoFijo } from '../componentes/simulador/InterfaceSim/GastoFijo.interface';
import { MateriaPrima } from '../componentes/simulador/InterfaceSim/MateriaPrima.interface';
export interface Simulador{
    id?: string,
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
