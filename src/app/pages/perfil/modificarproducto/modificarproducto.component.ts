import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { ProductoInterface } from '../../../Interfaces/producto-interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificarproducto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modificarproducto.component.html',
  styleUrl: './modificarproducto.component.css'
})


export class ModificarproductoComponent implements OnInit{
  @Input()
  productoId!: string;

  categorias: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Libros', 'Belleza', 'Juguetes', 'Deportes', 'Automotores', 'Alimentos', 'Mascotas', 'Otro'];

  @Input()
  idUser!: string;

  activated = inject(ActivatedRoute);
  productoServices = inject(ProductoServiceService);
  fb = inject(FormBuilder);


  producto: ProductoInterface | null = null;
  @Output() estadoCambiado = new EventEmitter<boolean>();

  // Formulario reactivo
  formulario = this.fb.group({
    idUser:[''],
    nombre: ['', Validators.required],
    categoria: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', Validators.required],
    deletedAt: [false],
    privado: [false],
    imagen: ['']
  });




  ngOnInit(): void {
    this.formulario.patchValue({ idUser: this.idUser });
    this.obtenerProducto(this.productoId);
  }

  cambiarEstado() {
    this.estadoCambiado.emit(false);
  }

  // Obtener el producto que se desea editar
  obtenerProducto(id: string) {
    this.productoServices.getProductoById(id).subscribe({
      next: (producto: ProductoInterface) => {
        this.producto = producto;
        this.formulario.patchValue({
          nombre: producto.nombre,
          categoria: producto.categoria,
          descripcion: producto.descripcion,
          precio: producto.precio,
          privado: producto.privado,
          imagen: producto.imagen

        });
      },
      error: (e) => {
        console.log(e.message);
      }
    });
  }

  // Método para actualizar un producto
  actualizarProducto() {
    if (this.formulario.invalid) return;

    const productoActualizado: ProductoInterface = {
      id: this.productoId,
      idUser: this.idUser,
      nombre: this.formulario.value.nombre || '',  // Si es null o undefined, usa una cadena vacía
      categoria: this.formulario.value.categoria || '',
      descripcion: this.formulario.value.descripcion || '',
      precio: this.formulario.value.precio || '',
      deletedAt:false,
      privado: this.formulario.value.privado || false,
      imagen: this.formulario.value.imagen || ''
    };

    this.productoServices.putProductos(this.productoId, productoActualizado).subscribe({
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
          title: "Producto actualizado"
        });
        this.cambiarEstado();
      },
      error: (e) => {
        console.log(e.message);
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el producto',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    });
  }
}

