import { ProductoInterface } from './../../../Interfaces/producto-interface';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AgregarProductoPerfilComponent } from '../agregar-producto-perfil/agregar-producto-perfil.component';

@Component({
  selector: 'app-mis-productos',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    AgregarProductoPerfilComponent
],
  templateUrl: './mis-productos.component.html',
  styleUrls: ['./mis-productos.component.css']
})
export class MisProductosComponent implements OnInit {
  productoServices = inject(ProductoServiceService);
  productos: ProductoInterface[] = [];
  textoBuscado: string = '';
  @Input() userId!: string; // Declarar explícitamente la propiedad
  
  ngOnInit(): void {
    this.obtenerProductos(this.userId);
  }

  obtenerProductos(idUsuario: string) {
    this.productoServices.getProductos(idUsuario).subscribe({
      next: (producto: ProductoInterface[]) => {
        this.productos = producto;
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }

  eliminarProducto(id: string | undefined) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar este producto?',
      text: '¡No podrás revertirlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServices.deleteProductosbyId(id).subscribe({
          next: () => {
            this.productos = this.productos.filter(producto => producto.id !== id);
          },
          error: (e) => {
            console.log(e.message);
          }
        });
      }
    });
  }

  leerTodo() {
    this.productoServices.getProductos(this.userId).subscribe({
      next: (productos: ProductoInterface[]) => {
        this.productos = this.textoBuscado
          ? productos.filter(producto =>
              producto.nombre.toLowerCase().includes(this.textoBuscado.toLowerCase())
            )
          : productos;
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  cambiarPrivacidad(idProducto: string | undefined): void {
    if(idProducto){
    this.productoServices.getProductoById(idProducto).subscribe({
      next: (producto: ProductoInterface) => {
        // Cambiar la privacidad del producto
        producto.privado = !producto.privado;
  
        // Actualizar el producto en el servidor
        this.productoServices.putProductos(this.userId, producto).subscribe({
          next: () => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
  
            Toast.fire({
              icon: 'success',
              title: 'La privacidad del producto se actualizó correctamente'
            });
          },
          error: (e: Error) => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar la privacidad del producto. Inténtalo nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            console.error(e);
          }
        });
      },
      error: (e: Error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener la información del producto. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error(e);
      }
    });
  }
  }
  
  abrirModal() {
    
  }
    
  }
