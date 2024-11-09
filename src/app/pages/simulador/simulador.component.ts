import { Component } from '@angular/core';
import { ListarSimuladorComponent } from "../../componentes/simulador/funciones/listar-simulador/listar-simulador.component";

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [ListarSimuladorComponent],
  templateUrl: './simulador.component.html',
  styleUrl: './simulador.component.css'
})
export class SimuladorComponent {

}
