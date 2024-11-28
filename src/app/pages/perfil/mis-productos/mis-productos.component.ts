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
  filtro: string = 'todos';
  booleanAgregar: boolean = false;
  booleanModificarProducto: boolean = false;
  productoId: string = '';
  productoAEditar?: ProductoInterface;
  currentPageProducto: number = 1;
  itemsPerPageProducto: number = 3;

  @Input() userId!: string; // Declarar explícitamente la propiedad

  ngOnInit(): void {
    this.obtenerProductos(this.userId);
    this.filtrar();
  }
   
  get productosPaginados(): ProductoInterface[] {
    const startIndex = (this.currentPageProducto - 1) * this.itemsPerPageProducto;
    return this.productos.slice(startIndex, startIndex + this.itemsPerPageProducto);
  }

 

totalPagesProducto(): number {
  return Math.ceil(this.productos.length / this.itemsPerPageProducto);
}

  goToPreviousPageProducto() {
    if (this.currentPageProducto > 1) {
      this.currentPageProducto--;
    }
  }

  goToNextPageProducto() {
    const totalPages = Math.ceil(this.productos.length / this.itemsPerPageProducto);
    if (this.currentPageProducto < totalPages) {
      this.currentPageProducto++;
    }
  }

  actualizarEstadoCrear(nuevoEstado: boolean) {
    this.booleanAgregar = nuevoEstado;
    this.actualizarProductosYFiltrar();
  }

  actualizarEstadoModificar(nuevoEstado: boolean) {
    this.booleanModificarProducto = nuevoEstado;
    this.actualizarProductosYFiltrar();
  }

  actualizarProductosYFiltrar() {
    this.obtenerProductos(this.userId);
    this.filtrar();
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
    if (idProducto) {
      Swal.fire({
        title: "¿Esta seguro?",
        text: "¿Desea cambiar la privacidad del producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
      }).then((result) => {
        if (result.isConfirmed) {
          this.productoServices.getProductoById(idProducto).subscribe({
            next: (producto: ProductoInterface) => {
              const nuevaPrivacidad = !producto.privado; // Cambiar la privacidad
              this.productoServices.putProductos(this.userId, { ...producto, privado: nuevaPrivacidad }).subscribe({
                next: () => {
                  // Actualizar la privacidad localmente
                  producto.privado = nuevaPrivacidad;
                  this.obtenerProductos(this.userId);
                },
                error: (e: Error) => {
                  console.error(e);
                  Swal.fire({
                    title: 'Error',
                    text: 'No se pudo actualizar la privacidad del producto.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  });
                }
              });
            },
            error: (e: Error) => {
              console.error(e);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener el producto.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          });
        }
      });

    }
  }

  modificarBooleanAgregar() {
    this.booleanAgregar = !this.booleanAgregar;
    this.productoAEditar = undefined; // Limpia el producto a editar
  }
  modificarProducto(id: string) {
    this.productoServices.getProductoById(id).subscribe({
      next: (producto) => {
        this.productoAEditar = producto;
        this.booleanModificarProducto = true;
      },
      error: (err) => console.error(err)
    });
  }

  modificarBooleanModificar() {
    this.booleanModificarProducto = !this.booleanModificarProducto;
   
  }


  filtrar() {
    this.productoServices.getProductos(this.userId).subscribe({
      next: (productos: ProductoInterface[]) => {
        // Filtrar los productos según el valor seleccionado
        if (this.filtro === 'privados') {
          this.productos = productos.filter(producto => producto.privado === true);
        } else if (this.filtro === 'publicos') {
          this.productos = productos.filter(producto => producto.privado === false);
        } else {
          this.productos = productos; // Mostrar todos los productos
        }
      },
      error: (e: Error) => {
        console.error('Error al filtrar los productos:', e.message);
      }
    });
  }

}
