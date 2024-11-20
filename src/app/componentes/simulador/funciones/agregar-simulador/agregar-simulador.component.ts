import { Simulador } from './../../InterfaceSim/Simulador.interface';
import { Component, EventEmitter, Inject, inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimuladorService } from '../../../../../Servicios/Simulador.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule, MatMiniFabButton} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-simulador',
  standalone: true,
  imports: [ReactiveFormsModule, 
    MatDialogModule,
     MatButtonModule, 
     MatStepperModule,
     FormsModule,
     MatFormFieldModule,
     MatInputModule,
     MatIconModule,
    ],
  templateUrl: './agregar-simulador.component.html',
  styleUrl: './agregar-simulador.component.css'
})
export class AgregarSimuladorComponent implements OnInit {
  
  fb= inject(FormBuilder);
  SimuladorService= inject(SimuladorService) ;
  tipo: string = ''; // Indica si es CREAR o EDITAR
  idUsuario: string= '';
  ruoter = inject(Router);
  activated= inject(ActivatedRoute);

  @Output() emitirSimulacion: EventEmitter<Simulador> = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<AgregarSimuladorComponent>,
    @Inject(MAT_DIALOG_DATA)public data: any
  
  ){ 
    this.idUsuario = data.idUsuario;
    this.tipo = data.tipo;
    // Si es edición, prellenar el formulario con los datos del simulador
    if (this.tipo === 'EDITAR' && data.simulador) {
      this.formulario.patchValue(data.simulador); // Rellena el formulario con los datos del simulador
      this.precioConGanancia = data.simulador.PrecioFinal || 0; // Opcional, si el precio ya está calculado
    }
   }

  ngOnInit(): void {
    console.log('Modo:', this.tipo);
    console.log('ID Usuario:', this.idUsuario);
  }
  
  activarRuta(idUsuario: string){
    this.SimuladorService.getSimulador(idUsuario).subscribe({
      next: (Simulador: Simulador[]) =>{
        
      }, error: (e:Error)=>{
        console.log(e.message);
      }
    })  }


  cancelar(){
    this.dialogRef.close();
  }
  
  guardar() {
    if (this.formulario.invalid) return;

    const simulador = this.formulario.getRawValue();
    simulador.idUsuario = this.idUsuario; // Asegúrate de asignar el ID de usuario
    simulador.PrecioFinal = this.precioConGanancia; // Calcula el precio final

    if (this.tipo === 'CREAR') {
      this.addSimuladorBD(simulador); // Crear un nuevo simulador
    } else if (this.tipo === 'EDITAR') {
      this.updateSimuladorBD(simulador); // Actualizar un simulador existente
    }

    this.dialogRef.close(simulador); // Devuelve el simulador al componente padre
  }


  //inicializa el formulario
  formulario = this.fb.nonNullable.group({
      idUsuario: '',
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precioMP: [0, [Validators.required]],
      cantidadMP: [0, [Validators.required]],
      UnidadDeCompraMP: [0, [Validators.required]],
      valorGF: [0, [Validators.required]],
      CantidadProductoMensual: [0, [Validators.required]],
      Ganancia: [0, [Validators.required]],
      PrecioFinal: [0],
      habilitado: true
    })
 
  


//----------------------- FUNCIONES

//-----------Crear un nuevo simulador

addSimuladorBD(simulador: Simulador){
  this.SimuladorService.postSimulador(simulador).subscribe(
    {
      next: (Simulador: Simulador) =>{
        Swal.fire("Simulacion guardada correctamente....");
        
      },
      error: (e: Error)=>{
          console.log(e.message);
      }
    }
  )
 }
//----------Actualizar un simulador existente
updateSimuladorBD(simulador: Simulador) {
  this.SimuladorService.putSimulador(simulador.idUsuario, simulador).subscribe({
    next: (simuladorActualizado: Simulador) => {
      alert('Simulador actualizado correctamente.');
    },
    error: (e: Error) => {
      console.error('Error al actualizar el simulador:', e.message);
    }
  });
}





///-------------------------FUNCIONALIDADES DE LA CALCULADORA DE COSTO-----
precioConGanancia: number = 0;
//sta sta bin
calcularGastoPorUnidad(): number {
  const cantidadMensual = this.formulario.get('CantidadProductoMensual')?.value || 1;

  const valorGF = this.formulario.get('valorGF')?.value || 0;

  return valorGF / cantidadMensual;
}
//sta sta bin
calcularCostoMateriaPrimaPorUnidad(): number {
  let costoTotalMateriaPrima = 0;
    const precioMP = this.formulario.get('precioMP')?.value || 0; 
    const cantidadMP = this.formulario.get('cantidadMP')?.value || 1; 
    const UnidadDeCompraMP = this.formulario.get('UnidadDeCompraMP')?.value || 1; 
    
    costoTotalMateriaPrima += (precioMP / UnidadDeCompraMP) * cantidadMP; 
    return costoTotalMateriaPrima;
}

calcularTodo() {
  const costoFijoPorUnidad = this.calcularCostoMateriaPrimaPorUnidad();
  const gastoFijoPorUnidad = this.calcularGastoPorUnidad();
  const ganancia = this.formulario.get('Ganancia')?.value || 30;
  const costoTotal = costoFijoPorUnidad + gastoFijoPorUnidad;
 // Calcular el precio final con ganancia y mantenerlo como número con 4 decimales
 this.precioConGanancia = parseFloat((costoTotal * (1 + ganancia / 100)).toFixed(2));
 return this.precioConGanancia;
 
}



}
let lastId = 0; 
export function generateIncrementalId(): string { lastId += 1; return `ID${lastId}`; }
  