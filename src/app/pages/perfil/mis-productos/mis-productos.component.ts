import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { CommonModule } from '@angular/common';
import { ProductoInterface } from '../../../Interfaces/producto-interface';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-productos',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule
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
}
