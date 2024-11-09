
import { GastoFijo } from './GastoFijo.interface';
import { MateriaPrima } from './MateriaPrima.interface';
export interface Simulador{
    id: number,
    nombre: string,
    GastoFijo: GastoFijo[],
    MateriaPrima: MateriaPrima [],
    CantidadProductoMensual?: number,
    Ganancia?: number,
    PrecioFinal: number,
    habilitado: boolean
}
