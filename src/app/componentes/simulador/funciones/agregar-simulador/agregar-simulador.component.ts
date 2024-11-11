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
import { v4 as uuidv4 } from 'uuid';
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
    MatMiniFabButton],
  templateUrl: './agregar-simulador.component.html',
  styleUrl: './agregar-simulador.component.css'
})
export class AgregarSimuladorComponent implements OnInit {
  formulario!: FormGroup; 
  fb= inject(FormBuilder);
  SimuladorService= inject(SimuladorService) ;
  precioConGanancia: number = 0;
  @Output() emitirSimulacion: EventEmitter<Simulador> = new EventEmitter();
  constructor(
    private dialogRef: MatDialogRef<AgregarSimuladorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ){ this.initForm(); }

  ngOnInit(): void {
    this.listenFormChanges();
  };
  
  cancelar(){
    this.dialogRef.close();
  }
  
  guardar(){
    this.emitirSimulacion.emit(this.formulario.value);
    this.dialogRef.close();
  }

  //inicializa el formulario
  initForm() {
    this.formulario = this.fb.nonNullable.group({
    
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precioMP: [[0, [Validators.required]]],
      cantidadUsadaMP: [0, [Validators.required]],
      UnidadDeCompraMP: [0, [Validators.required]],
      valorGF: [0, [Validators.required]],
      CantidadProductoMensual: [0, [Validators.required]],
      Ganancia: [0, [Validators.required]],
      PrecioFinal: [0, [Validators.required]],
      habilitado: [true]
    });
  }
  listenFormChanges() {
    // Recalcula cada vez que cambie un valor relevante en el formulario
    this.formulario.valueChanges.subscribe(() => {
      this.calcularTodo();
    });
  }


//----------------------- FUNCIONES

addSimulador(){
  if(this.formulario.invalid) return;
  const simulado= this.formulario.getRawValue();
  this.addSimuladorBD(simulado);
  this.emitirSimulacion.emit(simulado);
}

addSimuladorBD(Simulador: Simulador){
  this.SimuladorService.postSimulador(Simulador).subscribe(
    {
      next: (Simulador: Simulador) =>{
        alert('Simulador guardada....')
      },
      error: (e: Error)=>{
          console.log(e.message);
      }
    }
  )
 }





///-------------------------FUNCIONALIDADES DE LA CALCULADORA DE COSTO-----

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
 // Calcular el precio final con ganancia 
  return this.precioConGanancia = costoTotal * (1 + ganancia / 100); 
 
}



}
let lastId = 0; 
export function generateIncrementalId(): string { lastId += 1; return `ID${lastId}`; }
  