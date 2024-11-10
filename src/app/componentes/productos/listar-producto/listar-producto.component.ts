import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { CommonModule } from '@angular/common';
import { ProductoInterface, UsuariosxProductos } from '../../../Interfaces/producto-interface';

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
   
}
