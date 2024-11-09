import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoInterface } from '../../interfaces/producto.interface';
import { ProductoServiceService } from '../../../Servicios/producto-service.service';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos-page.component.html',
  styleUrl: './productos-page.component.css'
})
export class ProductosPageComponent {

  @Output()
  emitirProducto: EventEmitter<ProductoInterface> = new EventEmitter(); 

  categorias: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Libros', 'Belleza', 'Juguetes', 'Deportes', 'Automotores', 'Alimentos', 'Mascotas', 'Otro'];

  fb= inject(FormBuilder)
  productoService= inject(ProductoServiceService)

 /*No va a aceptar nincun campo que sea nulo con el nonnull.. */
  formulario = this.fb.nonNullable.group(
    {
      id: [0, Validators.required],
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, Validators.required]
    }
  )

  addProducto()
  {
    if(this.formulario.invalid) return; 

    const nproducto = this.formulario.getRawValue(); 
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
