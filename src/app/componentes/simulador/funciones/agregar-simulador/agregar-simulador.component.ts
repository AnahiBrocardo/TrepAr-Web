import { Simulador } from './../../InterfaceSim/Simulador.interface';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimuladorService } from '../../../../../Servicios/Simulador.service';

@Component({
  selector: 'app-agregar-simulador',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './agregar-simulador.component.html',
  styleUrl: './agregar-simulador.component.css'
})
export class AgregarSimuladorComponent {

  @Output() 
  emitirSimulacion: EventEmitter<Simulador>= new EventEmitter();

  fb= inject(FormBuilder);
  SimuladorService= inject(SimuladorService);

  formulario= this.fb.nonNullable.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    GastoFijo: this.fb.array([], Validators.required),
    MateriaPrima: this.fb.array([], Validators.required),
    antidadProductoMensual: [null, [Validators.min(0)]],
    Ganancia: [null, [Validators.min(0)]],
    PrecioFinal: [0, [Validators.required, Validators.min(0)]]
})
agregarGastoFijo() {
  const gastoFijoForm = this.fb.group({
    id: [0, Validators.required],
    nombre: ['', Validators.required], 
    valor: [null, Validators.min(0)]
  }); 
  (this.formulario.controls['GastoFijo'] as FormArray).push(gastoFijoForm);
}

agregarMateriaPrima() { 
  const materiaPrimaForm = this.fb.group({
     id: [0, Validators.required], 
     nombre: ['', Validators.required], 
     precio: [null, Validators.min(0)], 
     cantidad: [null, Validators.min(0)], 
     UnidadDeCompra: [null, Validators.min(0)] }); 
     (this.formulario.controls['MateriaPrima'] as FormArray).push(materiaPrimaForm);}

agregarSimulador(){
  if(this.formulario.invalid) return;
  const simulado= this.formulario.getRawValue();
  //this.addSimuladorBD(simulado)
  //this.emitirSimulacion.emit(simulado);
}

addSimuladorBD(Simulador: Simulador){
  this.SimuladorService.postSimulador(Simulador).subscribe(
    {
      next: (Simulador: Simulador) =>{
        alert('Simulacro guardado....')
      },
      error: (e: Error)=>{
          console.log(e.message);
      }
    }
  )
 }


simulado: Simulador={
    id: 0,
    nombre: '',
    GastoFijo: [],
    MateriaPrima: [],
    CantidadProductoMensual: 0,
    Ganancia: 0,
    PrecioFinal: 0
}

}
