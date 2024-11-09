import { Simulador } from './../../InterfaceSim/Simulador.interface';
import { Component, inject, OnInit } from '@angular/core';
import { SimuladorService } from '../../../../../Servicios/Simulador.service';
import { AgregarSimuladorComponent } from "../agregar-simulador/agregar-simulador.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-simulador',
  standalone: true,
  imports: [AgregarSimuladorComponent, RouterModule],
  templateUrl: './listar-simulador.component.html',
  styleUrl: './listar-simulador.component.css'
})
export class ListarSimuladorComponent implements OnInit{
listaSimulacions: Simulador[]= [];
SimuladorService= inject(SimuladorService);


ngOnInit(): void {
  this.listarTodasSimulaciones();
}
///----------------LISTAR TODAS LAS SIMULACIONES HECHAS----------------
listarTodasSimulaciones(){
  this.SimuladorService.getSimulador().subscribe(
    {
      next: (Simulador: Simulador[]) =>{
        this.listaSimulacions = Simulador
      }, error: (e:Error)=>{
        console.log(e.message);
      }
    }
   )
}
///----------------AGREGAR TODAS LAS SIMULACIONES HECHAS----------------
agregarLista(simulador: Simulador){
  this.listaSimulacions.push(simulador)
}
///----------------ELIMINAR UNA SIMULACION HECHAS-----------------------

delete(id: number){
  this.SimuladorService.deleteSimulador(id).subscribe(
    {
      next: ()=>{
        console.log('Actualizado');
      }, 
      error:(e:Error)=>{
        console.log('No se elimino');
      }
    }
  )
}



}
