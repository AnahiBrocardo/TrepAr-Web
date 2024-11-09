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
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'app-listar-simulador',
  standalone: true,
  imports: [MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatTooltipModule
    ],
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
        this.listaSimulacions = Simulador;
        this.dataSource.data = Simulador;
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

deleteSimulador(Simuladorid: number){
  let confirmacion= confirm('¿Esta seguro de eliminar esta simulacion de Costo?');
  if(confirmacion){
    let ids=[Simuladorid];
    this.SimuladorService.deleteSimulador(Simuladorid).subscribe(
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
///--------------visualizacion---------------------------
displayedColumns: string[] = ['id', 'nombre', 'PrecioFinal', 'accions'];
dataSource = new MatTableDataSource<Simulador>([]);
constructor() { this.leerTodo(); }

leerTodo() { 
  const inicio = this.numeroDePag * this.cantidadPorPagina; 
  const fin = inicio + this.cantidadPorPagina;

  this.SimuladorService.getSimulador().subscribe({
    next: (simuladores: Simulador[]) =>{
      let datosFiltrados = simuladores;

      // Filtrar por texto buscado 
      if (this.textoBuscado.trim() !== '') { 
        datosFiltrados = simuladores.filter(simulador =>
          simulador.nombre.toLowerCase().includes(this.textoBuscado.toLowerCase()) ); }

      this.cantidadTotal = datosFiltrados.length; // Ajuste según la estructura de tu respuesta 
      this.dataSource.data = datosFiltrados.slice(inicio, fin);// Suponiendo que la cantidad total es la longitud del array de simuladores 
       }, 
    error: (error) => { 
      console.error('Error al obtener los simuladores:', error); } }); }

///--------------paginado---------------------------
cantidadTotal= 0;
cantidadPorPagina= 10;
numeroDePag= 0;
opcionesDePaginado: number[] = [1 , 5, 10 , 20 , 50];

CambiarPagina(event: any){
  this.cantidadPorPagina = event.pageSize; 
  this.numeroDePag= event.pageIndex;
  this.leerTodo(); //esto no se si esta bien

}
///--------------Busqueda---------------------------
textoBuscado= '';




}