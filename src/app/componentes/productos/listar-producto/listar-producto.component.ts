import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { CommonModule } from '@angular/common';
import { ProductoInterface, UsuariosxProductos } from '../../../Interfaces/producto-interface';
import { of, switchMap } from 'rxjs';
import { ModificarSimuladorComponent } from '../../simulador/funciones/modificar-simulador/modificar-simulador.component';
import { MatIconModule } from '@angular/material/icon'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, NgModel } from '@angular/forms';
import { ProductosComponent } from '../productos.component';

@Component({
  selector: 'app-listar-producto',
  standalone: true,
  imports: [CommonModule, 
    MatIconModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatTableModule,
    MatTooltipModule, FormsModule ],
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
          this.leerTodo();
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

  textoBuscado: string = '';
  dataSource = new MatTableDataSource<ProductoInterface>();
  
leerTodo() { 
  console.log("Texto buscado:", this.textoBuscado); // Verifica el valor de textoBuscado
  
  this.productoServices.getProductos(this.userId).subscribe({
    next: (productos: ProductoInterface[]) => {
      console.log("Productos recibidos:", productos); // Verifica que los productos se reciben correctamente

      let datosFiltrados = productos;

      // Filtrar productos por el texto buscado
      if (this.textoBuscado && this.textoBuscado.trim() !== '') { 
        datosFiltrados = productos.filter(producto =>
          producto.nombre.toLowerCase().includes(this.textoBuscado.toLowerCase())
        );
      }

      // Verifica los productos filtrados
      this.productos = datosFiltrados;
      console.log("Productos filtrados:", this.productos); 

      // Actualiza dataSource para reflejar los datos filtrados
      //this.dataSource.data = datosFiltrados;
    },
    error: (error) => { 
      console.error('Error al obtener los productos:', error); 
    }
  });
}

  
  
}