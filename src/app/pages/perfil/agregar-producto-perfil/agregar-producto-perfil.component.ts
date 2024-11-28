import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoInterface } from '../../../Interfaces/producto-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agregar-producto-perfil.component.html',
  styleUrl: './agregar-producto-perfil.component.css'
})
export class AgregarProductoPerfilComponent implements OnInit{

  @Input() userId!: string; // Declarar explícitamente la propiedad
  
  @Output() estadoCambiadoAgregar = new EventEmitter<boolean>();
  @Output() productoModificado = new EventEmitter<boolean>();
  @Input() productoAEditar?: ProductoInterface; // Para recibir el producto
  
  categorias: string[] = [
    'Electrónica', 'Ropa', 'Hogar', 'Libros', 'Belleza',
    'Juguetes', 'Deportes', 'Automotores', 'Alimentos',
    'Mascotas', 'Otro'
  ];

  ngOnInit(): void {
    if (this.productoAEditar) {
      // Configura el formulario para edición
      this.formulario.patchValue({ idUser: this.userId });
      if(this.productoAEditar.id){
      this.obtenerProducto(this.productoAEditar.id);
      }
     
    } else {
      // Configura el formulario para agregar
      this.formulario.patchValue({ idUser: this.userId });
    }
  }

  router= inject(Router);

  fb= inject(FormBuilder)
  productoService= inject(ProductoServiceService)




      // Obtener el producto que se desea editar
  obtenerProducto(id: string) {
    this.productoService.getProductoById(id).subscribe({
      next: (producto: ProductoInterface) => {
        this.productoAEditar = producto;
        this.formulario.patchValue({
          nombre: producto.nombre,
          categoria: producto.categoria,
          descripcion: producto.descripcion,
          precio: producto.precio,
          privado: producto.privado,
          imagen: producto.imagen

        });
      },
      error: (e:Error) => {
        console.log(e.message);
      }
    });
  }

    /*No va a aceptar nincun campo que sea nulo con el nonnull.. */
    formulario = this.fb.nonNullable.group(
      {
        idUser: '',
        nombre: ['', Validators.required],
        categoria: ['', Validators.required],
        descripcion: ['', Validators.required],
        precio: ['', Validators.required],
        deletedAt: false,
        privado: [true, Validators.required],
        imagen:['']
      }
    )

    guardarProducto() {
      if (this.formulario.invalid) return;
  
      const producto = this.formulario.getRawValue();
  
      if (this.productoAEditar) {
        this.actualizarProductoDB(producto);
      } else {
        this.agregarProductoDB(producto);
      }
    }

 

  agregarProductoDB (nuevoProducto:ProductoInterface){
    this.productoService.postProductos(nuevoProducto).subscribe(
    
      {
        next: (producto: ProductoInterface) => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Producto Guardado"
          });
          this.estadoCambiadoAgregar.emit(false);

        },
        error: (e: Error) => {
          console.log(e.message);
        }
      }
    )

 
  }

  actualizarProductoDB(producto: ProductoInterface) {
    const productoActualizado: ProductoInterface = {
      id: this.productoAEditar?.id,
      idUser: this.userId,
      nombre: this.formulario.value.nombre || '',  // Si es null o undefined, usa una cadena vacía
      categoria: this.formulario.value.categoria || '',
      descripcion: this.formulario.value.descripcion || '',
      precio: this.formulario.value.precio || '',
      deletedAt:false,
      privado: this.formulario.value.privado || false,
      imagen: this.formulario.value.imagen || ''
    };

    if(productoActualizado.id)
    {
      this.productoService.putProductos(productoActualizado.id, productoActualizado).subscribe({
        next: () => {
          Swal.fire('Producto actualizado con éxito', '', 'success');
          this.productoModificado.emit(false); // Emitir evento al padre
        },
        error: (err:Error) => 
          console.error(err)
      });
    }
   
  }

}
