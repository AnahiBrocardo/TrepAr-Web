import { Component, inject, Input, OnInit } from '@angular/core';
import { Perfil } from '../../../../Interfaces/perfil.interface';
import { PerfilService } from '../../../../Servicios/perfil/perfil.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comunidad-principal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comunidad-principal.component.html',
  styleUrl: './comunidad-principal.component.css'
})
export class ComunidadPrincipalComponent implements OnInit{
  @Input()
  userId?:string;

  router= inject(Router);

  // Propiedades para almacenar los datos recibidos de la barra de busqueda
  textoBusqueda: string = '';
  filtro: string = 'emprendedores';
  perfilSeleccionadoId:string='';
  filtroPrincipal: string = 'emprendedores'; // Valor por defecto
  filtroSecundario: string = 'todos'; // Valor por defecto
  categorias: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Libros', 'Belleza', 'Juguetes', 'Deportes', 'Automotores', 'Alimentos', 'Mascotas', 'Otro'];
  isFavorito: boolean = false; // Indica si el perfil se encuentra en favoritos
  perfiles: Perfil[]=[

  ];
  favoritos: Set<string> = new Set<string>(); // IDs de perfiles favoritos
  perfilService= inject(PerfilService);

  ngOnInit(): void {
   this.obtenerTodosPerfiles();
   this.cargarFavoritos();
   
  }
  
    // Carga la lista de favoritos del usuario actual
    cargarFavoritos() {
      if (this.userId) {
        this.perfilService.getPerfilByIdUser(this.userId).subscribe({
          next: (perfilUsuario: Perfil[]) => {
            if (perfilUsuario[0]?.listaFavoritos) {
              // Inicializar el conjunto de favoritos con los IDs recibidos
              this.favoritos = new Set<string>(perfilUsuario[0].listaFavoritos);
            }
          },
          error: (e: Error) => console.error('Error al cargar favoritos:', e),
        });
      }
    }

     // Verifica si un perfil es favorito
  esFavorito(idPerfil: string): boolean {
    return this.favoritos.has(idPerfil);
  }


  obtenerTodosPerfiles(){
    this.perfilService.getPerfiles().subscribe({
      next: (perfiles: Perfil[])=>{
         // Filtrar los perfiles para excluir el perfil con idUser igual a this.idUser
         this.perfiles = perfiles.filter(perfil => perfil.idUser !== this.userId);
      },
      error:(e:Error)=>{
        console.log(e);
      }
    })
  }

  seleccionPerfil(perfilSeleccionadoId:string){
    localStorage.setItem('idPerfilSeleccionado', perfilSeleccionadoId);
    this.router.navigateByUrl('dashboard/comunidad/perfil');
  }

  cambiarFiltroPrincipal(event: Event): void {
    const filtroSeleccionado = (event.target as HTMLSelectElement).value;
    this.filtroPrincipal = filtroSeleccionado;

    // Cambia el segundo filtro según el valor seleccionado en el primero
    if (this.filtroPrincipal === 'emprendedores') {
      this.filtroSecundario = 'todos'; // Valor predeterminado
    } else if (this.filtroPrincipal === 'productos') {
      this.filtroSecundario = ''; // Muestra "Categorías" como predeterminado
    }
  }

  filtrarEmprendedores() {
    if (this.filtroSecundario === 'favoritos' && this.userId) {
      // Se obtiene la lista de favoritos del perfil actual
      this.perfilService.getPerfilByIdUser(this.userId).subscribe({
        next: (perfilArray: Perfil[]) => {
          if (perfilArray.length > 0 && perfilArray[0].listaFavoritos) {
            const favoritosIds = perfilArray[0].listaFavoritos; // IDs favoritos
            // Filtrar los perfiles favoritos
            this.perfiles = this.perfiles.filter(perfil => 
              perfil.id && favoritosIds.includes(perfil.id) // Comprobar si el ID está en favoritos
            );
          }
        },
        error: (e: Error) => {
          console.error('Error al obtener el perfil:', e);
        }
      });
    } else if (this.filtroSecundario === 'todos') {
      this.obtenerTodosPerfiles(); // Volver a cargar todos los perfiles
    }
  }


  alternarFavorito(idPerfil: string) {
    if (this.favoritos.has(idPerfil)) {
      this.favoritos.delete(idPerfil); // Quitar de favoritos
    } else {
      this.favoritos.add(idPerfil); // Agregar a favoritos
    }
  
    // Guardar los cambios en la base de datos
    this.actualizarFavoritosEnServidor(idPerfil);
  }
  
  actualizarFavoritosEnServidor(perfilSeleccionadoId: string) {
    if (this.userId && perfilSeleccionadoId) {
      this.perfilService.getPerfilByIdUser(this.userId).subscribe({
        next: (perfilUsuarios: Perfil[]) => {
          const perfil = perfilUsuarios[0];
  
          if (perfil && perfil.listaFavoritos) {
            // Actualizar la lista local de favoritos
            if (this.favoritos.has(perfilSeleccionadoId)) {
              perfil.listaFavoritos.push(perfilSeleccionadoId); // Agregar a favoritos
            } else {
              perfil.listaFavoritos = perfil.listaFavoritos.filter(
                (id) => id !== perfilSeleccionadoId
              ); // Quitar de favoritos
            }
  
            // Enviar la actualización al servidor
            if (perfil.id) {
              this.perfilService.actualizarPerfilByIdUser(perfil.id, perfil).subscribe({
                next: () => {
                },
                error: (e) => {
                  console.error('Error al actualizar favoritos:', e);
                },
              });
            } else {
              console.error('El perfil no tiene un ID válido.');
            }
          } else {
            console.error('El perfil o la lista de favoritos no son válidos.');
          }
        },
        error: (e) => {
          console.error('Error al obtener el perfil:', e);
        },
      });
    } else {
      console.error('userId o perfilSeleccionadoId no están definidos.');
    }
  }
  
  
  
}
