import { Component, inject, Input, OnInit } from '@angular/core';
import { Perfil } from '../../../../Interfaces/perfil.interface';
import { PerfilService } from '../../../../Servicios/perfil/perfil.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoServiceService } from '../../../../Servicios/productos/productos-service.service';
import { ProductoInterface } from '../../../../Interfaces/producto-interface';
import { ProductoConUsuario } from '../../../../Interfaces/productoConUsuario';
import { forkJoin, map, switchMap } from 'rxjs';

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

  productoService= inject(ProductoServiceService);
  router= inject(Router);

  // Propiedades para almacenar los datos recibidos de la barra de busqueda
  textoBusqueda: string = '';
  filtro: string = 'emprendedores';
  perfilSeleccionadoId:string='';
  filtroPrincipal: string = 'emprendedores'; // Valor por defecto
  filtroSecundario: string = 'todos'; // Valor por defecto
  categorias: string[] = ['Todos', 'Electrónica', 'Ropa', 'Hogar', 'Libros', 'Belleza', 'Juguetes', 'Deportes', 'Automotores', 'Alimentos', 'Mascotas', 'Otro'];
  isFavorito: boolean = false; // Indica si el perfil se encuentra en favoritos

  perfiles: Perfil[]=[];
  perfilesOriginales: Perfil[] = [];
  // Variable para almacenar la lista original de productos
productosOriginales: ProductoConUsuario[] = []; 

// Variable para almacenar los productos filtrados que se muestran en la interfaz
productos: ProductoConUsuario[] = [];

  favoritos: Set<string> = new Set<string>(); // IDs de perfiles favoritos

  perfilService= inject(PerfilService);

  ngOnInit(): void {
   this.obtenerTodosPerfiles();
   this.cargarFavoritos();
   this.obtenerProductosPublicos();
  }

  obtenerTodosPerfiles(){
    this.perfilService.getPerfiles().subscribe({
      next: (perfiles: Perfil[])=>{
         // Filtrar los perfiles para excluir el perfil con idUser igual a this.idUser
        this.perfilesOriginales  = perfiles.filter(perfil => perfil.idUser !== this.userId);
        this.perfiles = [...this.perfilesOriginales];
        },
      error:(e:Error)=>{
        console.log(e);
      }
    })
  }

  obtenerProductosPublicos() {
    this.productoService.getAllProductos().pipe(
      // Filtra productos al inicio
      switchMap((productosArray: ProductoInterface[]) => {
        const productosFiltrados = productosArray.filter(
          (producto) => !producto.privado && producto.idUser !== this.userId
        );
  
        // Para cada producto, obtenemos el perfil
        const observables = productosFiltrados.map((producto) =>
          this.perfilService.getPerfilByIdUser(producto.idUser).pipe(
            map((perfilArray) => ({ //Combina cada producto con el perfil devuelto por getPerfilByIdUser
              producto: producto,
              userName: perfilArray[0]?.userName || 'Usuario desconocido',
            }))
          )
        );
        return forkJoin(observables); //Espera a que todas las solicitudes de perfiles (una por cada producto) terminen antes de emitir un único array con los resultados combinados.
      })
    ).subscribe({
      next: (productosConUsuario) => {
        this.productos = productosConUsuario;
      },
      error: (err) => {
        console.error('Error al obtener los productos o perfiles:', err);
      },
    });
     // Aseguramos que se obtienen todos los productos y los guardamos en productosOriginales
  this.productosOriginales = [...this.productos];  // Guardamos una copia de los productos originales
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
      this.filtrarEmprendedores();
    } else if (this.filtroPrincipal === 'productos') {
      this.filtroSecundario = ''; // Muestra "Categorías" como predeterminado
      this.obtenerProductosPublicos(); // Recargar los productos
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
            this.perfiles = this.perfilesOriginales.filter(perfil => 
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

  seleccionPerfilProducto(idUser: string){
    this.perfilService.getPerfilByIdUser(idUser).subscribe({
      next: (perfilUsuarios: Perfil[]) => {
        const perfil = perfilUsuarios[0];
        if(perfil.id){
          localStorage.setItem('idPerfilSeleccionado', perfil.id);
          this.router.navigateByUrl('dashboard/comunidad/perfil');
        }      
      },
      error: (e:Error) => {
        console.error(e.message);
      },
    })
    
  }

  filtrarProductosPorCategoria(): void {
    if (this.filtroSecundario) {
      // Si es la primera vez que se carga la lista, obtenemos todos los productos
      if (this.productosOriginales.length === 0) {
        this.obtenerProductosPublicos();  // Esta función se encargará de cargar los productos originales
      }
  
      if (this.filtroSecundario.toLowerCase() === 'todos') {
        // Si la categoría seleccionada es 'todos', mostramos todos los productos
        this.productos = [...this.productosOriginales];  // Copiamos todos los productos originales
      } else {
        // Filtramos la lista original de productos por la categoría seleccionada
        this.productos = this.productosOriginales.filter(
          (item) => item.producto.categoria.toLowerCase() === this.filtroSecundario.toLowerCase()
        );
      }
    }
  }

  filtrarPorBusqueda(): void {
    const textoBusquedaLower = this.textoBusqueda.toLowerCase();

    if (this.filtroPrincipal === 'emprendedores') {
      this.perfiles = this.perfilesOriginales.filter((perfil) =>
        perfil.userName.toLowerCase().includes(textoBusquedaLower)
      );
    } else if (this.filtroPrincipal === 'productos') {
      this.productos = this.productosOriginales.filter((productoConUsuario) =>
        productoConUsuario.producto.nombre
          .toLowerCase()
          .includes(textoBusquedaLower)
      );
    }
  }
  
  
}
