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
import { Router } from '@angular/router';

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

userId?:string;

perfilSeleccionadoIdPerfil?:string;
isFavorito: boolean = false; // Indica si el perfil se encuentra en favoritos

perfilSeleccionado?:Perfil;
textoBuscado: string = '';

router= inject(Router);

perfilService= inject(PerfilService);
productoService= inject(ProductoServiceService);

listaProductos:ProductoInterface[]=[];

  ngOnInit(): void {
    this.perfilSeleccionadoIdPerfil= localStorage.getItem('idPerfilSeleccionado') || '';
    this.userId=localStorage.getItem('userId') || '';
    this.obtenerDatosPerfil();
    this.verificarSiEsFavorito();
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

  verificarSiEsFavorito() {
    if (this.userId && this.perfilSeleccionadoIdPerfil) {
      this.perfilService.getPerfilByIdUser(this.userId).subscribe({
        next: (perfilUsuarios: Perfil[]) => {
          if (perfilUsuarios[0] && perfilUsuarios[0].listaFavoritos) {
            // Verifica si el perfil está en la lista de favoritos
            this.isFavorito = perfilUsuarios[0].listaFavoritos.includes(this.perfilSeleccionadoIdPerfil!);
          }
          
        },
        error: (e) => {
          console.error('Error al verificar favoritos:', e);
        },
      });
    }
  }

  leerTodo() {
        this.listaProductos = this.textoBuscado
          ? this.listaProductos.filter(producto =>
              producto.nombre.toLowerCase().includes(this.textoBuscado.toLowerCase())
            )
          : this.listaProductos;
  }

  volverComunidad(){
    localStorage.removeItem('idPerfilSeleccionado');
    this.router.navigateByUrl('dashboard/comunidad')
  }

  alternarFavorito() {
    if (this.userId && this.perfilSeleccionadoIdPerfil) {
      this.perfilService.getPerfilByIdUser(this.userId).subscribe({
        next: (perfilUsuarios: Perfil[]) => {
          if (perfilUsuarios[0]) {
            const perfil = perfilUsuarios[0];
  
            if(perfil.listaFavoritos){

            if (this.isFavorito) {
              // Eliminar de favoritos
              perfil.listaFavoritos = perfil.listaFavoritos.filter(
                (id) => id !== this.perfilSeleccionadoIdPerfil
              );
            } else {
              // Agregar a favoritos
              if(this.perfilSeleccionadoIdPerfil){
            perfil.listaFavoritos.push(this.perfilSeleccionadoIdPerfil);
              }
              
            }
           
            if(perfil.id){
            // Actualizar la lista de favoritos en el servidor
            this.perfilService.actualizarPerfilByIdUser(perfil.id, perfil).subscribe({
              next: () => {
                this.isFavorito = !this.isFavorito; // Alternar el estado de favorito
              },
              error: (e) => {
                console.error('Error al actualizar favoritos:', e);
              },
            });
          }
          }
          } else {
            console.log('No se encontró un perfil válido.');
          }
        },
        error: (e) => {
          console.log('Error al obtener el perfil:', e);
        },
      });
    }
  }
}
