import { Simulador } from '../../../../Interfaces/Simulador.interface'; 
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AgregarSimuladorComponent } from "../agregar-simulador/agregar-simulador.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { SimuladorService } from '../../../../Servicios/Simulador/Simulador.service';

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
    MatTooltipModule,
    MatDialogModule,
    ],
  templateUrl: './listar-simulador.component.html',
  styleUrl: './listar-simulador.component.scss'
})
export class ListarSimuladorComponent implements OnInit  {
listaSimulacions: Simulador[]= [];
SimuladorService= inject(SimuladorService);
idUsuario: string = '';

constructor(private route: ActivatedRoute,  private router: Router) { }

ngOnInit(): void {
  this.idUsuario = localStorage.getItem('userId') || '';
  if (this.idUsuario) { this.listarTodasSimulaciones(this.idUsuario); }

}
 // Método para navegar a AgrgarSimuladorComponent 

///----------------LISTAR TODAS LAS SIMULACIONES HECHAS----------------
listarTodasSimulaciones(idUsuario: string){
  this.SimuladorService.getSimulador(idUsuario).subscribe(
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

deleteSimulador(Simuladorid: number) {
  Swal.fire({
    title: "¿Esta seguro de eliminar esta simulacion de costo?",
    text: "¡No podrás revertirlo!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar"
  }).then((result) => {
    if (result.isConfirmed) {
      this.SimuladorService.deleteSimulador(Simuladorid).subscribe({
        next: () => {
          Swal.fire("Simulacion eliminada correctamente");
          this.leerTodo();
        },
        error: (e: Error) => {
          console.log('No se elimino');
        }
      });
    }
  }).catch((error) => {
    console.log(error); // Si ocurre algún error en la verificación de la contraseña, no eliminar
  });
}

///--------------visualizacion---------------------------
displayedColumns: string[] = ['id', 'nombre', 'PrecioFinal', 'accions'];
dataSource = new MatTableDataSource<Simulador>([]);


leerTodo() { 
  const inicio = this.numeroDePag * this.cantidadPorPagina; 
  const fin = inicio + this.cantidadPorPagina;

  this.SimuladorService.getSimulador(this.idUsuario).subscribe({
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
cantidadPorPagina= 8;
numeroDePag= 0;
opcionesDePaginado: number[] = [1 , 5, 8];

CambiarPagina(event: any){
  this.cantidadPorPagina = event.pageSize; 
  this.numeroDePag= event.pageIndex;
  this.leerTodo(); //esto no se si esta bien

}
///--------------Busqueda---------------------------
textoBuscado= '';

///--------------AGREGAR---------------------------
readonly dialog = inject(MatDialog);
agregarSimulado() {
  ///abre la ventana modal en l formulario
  const dialogRef = this.dialog.open(AgregarSimuladorComponent, {
    disableClose: true, // esto hace que si hago click por fuera de la ventana modal no se me cierre
    autoFocus: true, // esto hace que se ponga el foco del mouse n la veentana que se abre
    closeOnNavigation: false, //por si se aprieta algo fuera de la ventana
    position: {top: '10vh'},
    width: '80vw',// Ancho del 80% del viewport
    maxHeight: '90vh',
    data: {
      tipo: 'CREAR',
      idUsuario: this.idUsuario // Pasa el idUsuario al diálogo
    }
  });

  //resultado y funcion de la ventana 
  dialogRef.afterClosed().subscribe(result => {
    this.listarTodasSimulaciones(this.idUsuario); //Método para recargar la lista
    });
}


///--------------MODIFICAR---------------------------
editarSimulador(simulador: Simulador) {
  const dialogRef = this.dialog.open(AgregarSimuladorComponent, {
    disableClose: true,
    autoFocus: true,
    closeOnNavigation: false,
    position: { top: '10vh' },
    width: '80vw',
    maxHeight: '90vh',
    data: {
      tipo: 'EDITAR', // Modo edición
      simulador: simulador,// Pasa los datos del simulador
      idUsuario: this.idUsuario
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      this.listarTodasSimulaciones(this.idUsuario); //Método para recargar la lista
    }
  });
}


}