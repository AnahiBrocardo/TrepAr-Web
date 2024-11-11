import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { CommonModule } from '@angular/common';
import { ProductoInterface, UsuariosxProductos } from '../../../Interfaces/producto-interface';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-listar-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-producto.component.html',
  styleUrl: './listar-producto.component.css'
})
export class ListarProductoComponent implements OnInit{
  activated= inject(ActivatedRoute);
  userId: string='';
  
  ngOnInit(): void {
    this.activated.paramMap.subscribe({
      next:(param)=>{
        const id= param.get('id');
        if(id){
          this.userId=id;
          console.log('UserId obtenido:', this.userId); // Verifica que el userId se obtiene correctamente
          this.obtenerProductos(); // Llamamos a obtenerProductos después de asignar el userId
        }
      }
    })
  }

  productoServices = inject(ProductoServiceService)
  
  
  productos: ProductoInterface[] = []; // Aquí se almacenarán los productos del usuario
  obtenerProductos() {
    this.productoServices.obtenerUsuarioPorId(this.userId).subscribe(usuario => {
      if (usuario) {
        console.log('Productos encontrados:', usuario[0].productoInterface); //solo devuelve los datos asignados con ese usuario y por eso siempre me devuelve 1 porque se supone que es unico
        this.productos = usuario[0].productoInterface; // Asignamos los productos del usuario
      } else {
        console.log('Usuario no encontrado');
        this.productos = []; // Si no se encuentra el usuario, asignamos un arreglo vacío
      }
    });
  }


  /*
//Sector del servidor productoUserServices
productoUserService = inject(ProductosUserServicesService)
productoInterface: ProductoInterface[] = [];
elementoEspecifico: ProductoInterface | undefined;

obtenerDatos(): void {
  // Llamar a la API para obtener el arreglo completo productoInterface
  this.productoUserService.getProductoInterface(this.userId).subscribe(data => {
    this.productoInterface = data;
  });
}

obtenerUnProductoxId(idproducto: string)
{
   // Llamar a la API para obtener un elemento específico dentro de productoInterface
   this.productoUserService.getElementoProductoInterface(this.userId, idproducto).subscribe(data => {
    this.elementoEspecifico = data;
  });
}

// Método para eliminar un elemento dentro de productoInterface
eliminarElemento(elementoId: string | undefined): void {
  this.productoUserService.deleteElementoProductoInterface(this.userId, elementoId).subscribe( usuario => {
    console.log('Elemento eliminado');
    this.obtenerDatos(); // Vuelves a cargar los productos después de eliminar
  }, error => {
    console.error('Error al eliminar elemento', error);
  });
 }*/
}