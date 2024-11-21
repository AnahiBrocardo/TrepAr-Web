import { PerfilService } from './../../../../Servicios/perfil/perfil.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductoInterface } from '../../../../Interfaces/producto-interface';
import { Perfil } from '../../../../Interfaces/perfil.interface';
import { ProductoServiceService } from '../../../../Servicios/productos/productos-service.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-comunidad',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,  
    FormsModule
  ],
  templateUrl: './perfil-comunidad.component.html',
  styleUrl: './perfil-comunidad.component.css'
})
export class PerfilComunidadComponent implements OnInit{
@Input()
userId?:string;

@Input()
perfilSeleccionadoIdPerfil?:string;

perfilSeleccionado?:Perfil;
textoBuscado: string = '';

perfilService= inject(PerfilService);
productoService= inject(ProductoServiceService);

listaProductos:ProductoInterface[]=[];

  ngOnInit(): void {
    this.obtenerDatosPerfil();
  }

  obtenerDatosPerfil(){
    if(this.perfilSeleccionadoIdPerfil){
      this.perfilService.getPerfilByIdPerfil(this.perfilSeleccionadoIdPerfil).subscribe({
        next: (perfilArray: Perfil[]) => {
          if (perfilArray.length > 0) {
            this.perfilSeleccionado = perfilArray[0]; 
            this.obtenerDatosDeProducto(this.perfilSeleccionado.idUser);
          } else {
            console.error('El perfil no existe o no se encontró.');
          }
        },
        error: (e: Error) => {
          console.error('Error al obtener el perfil:', e);
        }
      })
    }
  }

    obtenerDatosDeProducto(iduser:string){
      if(iduser){
        this.productoService.getProductos(iduser).subscribe({
          next:(productos: ProductoInterface[]) => {
            // Filtrar los productos donde 'privado' es false
            const productosPublicos = productos.filter(producto => !producto.privado);
            this.listaProductos = productosPublicos;  // Almacenar productos públicos
          },
          error: (e) => {
            console.error('Error al obtener los productos:', e);
          }
        })
      }
  
  }

  leerTodo() {
        this.listaProductos = this.textoBuscado
          ? this.listaProductos.filter(producto =>
              producto.nombre.toLowerCase().includes(this.textoBuscado.toLowerCase())
            )
          : this.listaProductos;
  }
}
