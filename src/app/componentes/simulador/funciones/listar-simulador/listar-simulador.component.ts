import { Simulador } from './../../InterfaceSim/Simulador.interface';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { SimuladorService } from '../../../../../Servicios/Simulador.service';
import { AgregarSimuladorComponent } from "../agregar-simulador/agregar-simulador.component";
import { RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-listar-simulador',
  standalone: true,
  imports: [MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatTableModule,
    MatPaginatorModule],
  templateUrl: './listar-simulador.component.html',
  styleUrl: './listar-simulador.component.scss'
})
export class ListarSimuladorComponent implements OnInit  {
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
///--------------visualizacion---------------------------
displayedColumns: string[] = ['id', 'nombre', 'PrecioFinal', 'accions'];
dataSource = new MatTableDataSource<Simulador>([]);
constructor() { this.leerTodo(); }

leerTodo() {
   this.SimuladorService.getSimulador().subscribe( 
    (respuesta: any) => { 
      this.dataSource.data = respuesta; // Ajuste según la estructura de tu respuesta 
    },
    (error) => { console.error('Error al obtener los simuladores:', error); } ); }


}