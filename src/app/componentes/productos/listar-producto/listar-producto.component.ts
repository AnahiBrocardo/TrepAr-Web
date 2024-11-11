import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { CommonModule } from '@angular/common';
import { ProductoInterface, UsuariosxProductos } from '../../../Interfaces/producto-interface';
import { of, switchMap } from 'rxjs';
import { ModificarSimuladorComponent } from '../../simulador/funciones/modificar-simulador/modificar-simulador.component';

@Component({
  selector: 'app-listar-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-producto.component.html',
  styleUrl: './listar-producto.component.css'
})
export class ListarProductoComponent implements OnInit{
  router = inject(Router);  // Inyectamos el router
  activated= inject(ActivatedRoute);
  userId: string='';
  
  ngOnInit(): void {
    this.activated.paramMap.subscribe({
      next:(param)=>{
        const id= param.get('id');
        if(id){
          this.userId=id;
          console.log('UserId obtenido:', this.userId); // Verifica que el userId se obtiene correctamente
          this.obtenerProductos(this.userId); // Llamamos a obtenerProductos después de asignar el userId
        }
      }
    })
  }

  productoServices = inject(ProductoServiceService)
  productos: ProductoInterface[] = []; // Aquí se almacenarán los productos del usuario
  
  
  obtenerProductos(idUsuario: string) {
    this.productoServices.getProductos(idUsuario).subscribe(
      {
        next: (producto: ProductoInterface[]) => {
          this.productos = producto; 
        }, error: (e:Error)=>{
          console.log(e.message); 
        }
      }
    )
  }

  // Función para eliminar un producto
  eliminarProducto(id: string | undefined) {
    this.productoServices.deleteProductosbyId(id).subscribe({
      next: () => {
        // Después de eliminar, actualizamos la lista de productos
        this.productos = this.productos.filter(producto => producto.id !== id);
        alert('Producto eliminado correctamente');
      },
      error: (e) => {
        console.log(e.message);
        alert('Error al eliminar el producto');
      }
    });
  }

  editarProducto(id: string ) {
    this.router.navigate(['/producto/editar', id]);  // Redirige a la página de edición con el id
  }
}