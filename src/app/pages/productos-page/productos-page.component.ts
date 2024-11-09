
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoInterface } from '../../interfaces/producto.interface';
import { ProductoServiceService } from '../../../Servicios/producto-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './productos-page.component.html',
  styleUrl: './productos-page.component.css'
})
export class ProductosPageComponent {
  
  fb= inject(FormBuilder)
  productoService= inject(ProductoServiceService)
  //submit = false


  categorias: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Libros', 'Belleza', 'Juguetes', 'Deportes', 'Automotores', 'Alimentos', 'Mascotas', 'Otro'];
  
  
  /*No va a aceptar nincun campo que sea nulo con el nonnull.. */
  formulario = this.fb.nonNullable.group(
    {
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required]
    }
  )
  
  @Output()
  emitirProducto: EventEmitter<ProductoInterface> = new EventEmitter(); 
 
  addProducto()
  {
    if(this.formulario.invalid) return; 

    const nproducto: ProductoInterface = this.formulario.getRawValue(); 
    this.addProductoDB(nproducto)
    this.emitirProducto.emit(nproducto); 
  }

  addProductoDB (producto: ProductoInterface){
    this.productoService.postProductos(producto).subscribe(
      {
        next: (producto: ProductoInterface) => {
          console.log(producto); 
          alert('Tarea Guardada')
        },
        error: (e: Error) => {
          console.log(e.message); 
        }
      }
    )
  }
}
