import { Simulador } from '../../../../Interfaces/Simulador.interface';
import { Component, EventEmitter, Inject, inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule, MatMiniFabButton} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, CommonModule } from '@angular/common';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation, MatStepperModule, MatStepContent} from '@angular/material/stepper';
import { SimuladorService } from '../../../../Servicios/Simulador/Simulador.service';

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
     MatTooltipModule,
     CommonModule
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
  
  idSimulador:string='';

  @Output() emitirSimulacion: EventEmitter<Simulador> = new EventEmitter();

  camposIncompletos:boolean=false;

  constructor(
    private dialogRef: MatDialogRef<AgregarSimuladorComponent>,
    @Inject(MAT_DIALOG_DATA)public data: any
  
  ){ 
    this.idUsuario = data.idUsuario;
    this.tipo = data.tipo;
    // Si es edición, prellenar el formulario con los datos del simulador
    if (this.tipo === 'EDITAR' && data.simulador) {
      this.idSimulador=data.simulador.id;
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
      precioMP: [0, [Validators.required, Validators.min(1)]],
      cantidadMP: [0, [Validators.required, Validators.min(1)]],
      UnidadDeCompraMP: [0, [Validators.required, Validators.min(1)]],
      valorGF: [0, [Validators.required, Validators.min(1)]],
      CantidadProductoMensual: [0, [Validators.required, Validators.min(1)]],
      Ganancia: [0, [Validators.required, Validators.min(1)]],
      PrecioFinal: [0],
      habilitado: true
    })
 
      // Método para verificar si el formulario es válido en un paso específico
  isStepValid(controlName: string): boolean {
    const control = this.formulario.get(controlName);
    return control?.valid || false;
  }
  


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
  if (this.idSimulador) {
    this.SimuladorService.putSimulador(this.idSimulador, simulador).subscribe({
      next: (simuladorActualizado: Simulador) => {
        Swal.fire("Cambios guardados");
      },
      error: (e: Error) => {
        console.error('Error al actualizar el simulador:', e.message);
      }
    });
  } else {
    console.error('ID del simulador no encontrado.');
  }
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
 this.camposIncompletos=false;
 return this.precioConGanancia;
 
}



}

  