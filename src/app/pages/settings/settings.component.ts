import { Simulador } from './../../Interfaces/Simulador.interface';
import { UpdateUserComponent } from './../update/update-user/update-user.component';
import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../Interfaces/user.interface';
import {  Router } from '@angular/router';
import { UserService } from '../../Servicios/usuario/user.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../Servicios/perfil/perfil.service';
import { Perfil } from '../../Interfaces/perfil.interface';
import { ProductoServiceService } from '../../Servicios/productos/productos-service.service';
import { SimuladorService } from '../../Servicios/Simulador/Simulador.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [UpdateUserComponent, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
  userService= inject(UserService);
  userLoginOn:boolean=false;
  userData?:User;
  // Control de visibilidad del formulario
  mostrarFormulario: boolean = false;
  router= inject(Router);
  simuladorService= inject(SimuladorService);
  perfilSevice= inject(PerfilService);
  productoService= inject(ProductoServiceService);

  userId: string='';

  imagenPerfil: string='';

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    this.usuarioData(this.userId);
    this.obtenerImagenPerfil();
  }

  usuarioData(id:string){
    this.userService.getUserById(id).subscribe({
      next:(user:User)=>{
        this.userData=user;
      },
      error:(e:Error)=>{
        console.log(e);
      }
    })
  }

  obtenerImagenPerfil(){
  this.perfilSevice.getPerfilByIdUser(this.userId).subscribe({
    next: (perfiles:Perfil[])=>{
      if(perfiles[0].imagePerfil){
        this.imagenPerfil= perfiles[0].imagePerfil;
      }
    }
  })
  }

   // Método para alternar la visibilidad del formulario
   toggleModificar() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  async deleteUsuario() {
    if (this.userData) {
      // Asigna la fecha actual al campo deletedAt
      this.userData.deletedAt = new Date();
      // Llama al servicio para actualizar el usuario
      try {
        await this.userService.updateUser(this.userData).toPromise();
        await this.borrarDatosPerfil(); // Espera a que se borren los datos del perfil
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.router.navigate(['']).then(() => {
          window.location.reload(); // Refresca la página completamente
        });
      } catch (err) {
        console.error('Error al actualizar el usuario o borrar datos del perfil:', err);
      }
    } else {
      console.error('No se pudo actualizar el usuario: userData es indefinido');
    }
  }
  
  async verificacionEliminacion() {
    const result = await Swal.fire({
      title: "¿Estás seguro que deseas eliminar la cuenta?",
      text: "¡No podrás revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    });
  
    if (result.isConfirmed) {
      try {
        // Llama a la función para verificar la contraseña y espera su resultado
        await this.verificarPassword();
        // Si la verificación es exitosa, llama a deleteUsuario
        await this.deleteUsuario();
      } catch (error) {
        console.log(error); // Maneja cualquier error en la verificación de la contraseña
      }
    }
  }
  

  async borrarDatosPerfil() {
    try {
      // Espera a que cada método de borrado se complete en orden.
      await this.borrarPerfil();
      await this.borrarTodosProductosPerfil();
      await this.eliminarSimuladoresDeUsuario();
      console.log('Todos los datos de perfil han sido borrados exitosamente.');
    } catch (error) {
      console.error('Error al borrar datos de perfil:', error);
    }
  }
  
  async borrarPerfil(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.perfilSevice.getPerfilByIdUser(this.userId).subscribe({
        next: (perfiles: Perfil[]) => {
          const idPerfil = perfiles[0]?.id;
          if (idPerfil) {
            this.perfilSevice.deletePerfilById(idPerfil).subscribe({
              next: () => {
                resolve();
              },
              error: (e: Error) => {
                console.error('Error al borrar perfil:', e);
                reject(e);
              }
            });
          } else {
            resolve(); // No hay perfil para borrar
          }
        },
        error: (e: Error) => {
          console.error('Error al obtener perfil:', e);
          reject(e);
        }
      });
    });
  }
  
  async borrarTodosProductosPerfil(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productoService.deleteAllProductosByUserId(this.userId).subscribe({
        next: () => {
          resolve();
        },
        error: (error: Error) => {
          console.error('Error al borrar productos:', error);
          reject(error);
        }
      });
    });
  }
  
  async eliminarSimuladoresDeUsuario(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.simuladorService.getSimulador(this.userId).subscribe({
        next: (simuladores: Simulador[]) => {
          if (simuladores.length > 0) {
            const deleteRequests = simuladores.map((simulador) =>
              this.simuladorService.emininarUnSimulador(simulador.id)
            );
    
            forkJoin(deleteRequests).subscribe({
              next: () => {
                resolve();
              },
              error: (error: Error) => {
                console.error('Error al eliminar simuladores:', error);
                reject(error);
              }
            });
          } else {
            resolve(); // No hay simuladores para borrar
          }
        },
        error: (error: Error) => {
          console.error('Error al obtener simuladores:', error);
          reject(error);
        }
      });
    });
  }
  
async verificarPassword() {
  try {
    const result = await Swal.fire({
      title: "Ingrese contraseña, para poder eliminar la cuenta...",
      input: "password",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        return new Promise((resolve, reject) => {
          if (password) {
            if(this.userId){
            // Verificar si la contraseña ingresada es correcta
            this.userService.getUserById(this.userId).subscribe({
              next: (user) => {
                if (user.password===password) {
                  resolve(password);  
                  
                } else {
                  reject('La contraseña ingresada no es correcta');
                  Swal.fire('Error', 'La contraseña ingresada no es correcta');
                }
              },
              error: (err: Error) => {
                reject(`Error al verificar la contraseña: ${err.message}`);
                console.error("Error al verificar la contraseña:", err);
              }
            });
          } else {
            reject('Por favor, ingrese su contraseña');
          }
        }
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isConfirmed) {
      return Promise.resolve(); // La contraseña fue correcta
      Swal.fire({
        title: `Cuenta Eliminada`,
        text: ``
      });
    }
  } catch (error) {
    Swal.showValidationMessage(`Solicitud fallida: ${error}`);
  }
}


}
