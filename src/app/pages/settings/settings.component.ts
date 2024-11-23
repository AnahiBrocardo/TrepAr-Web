import { UpdateUserComponent } from './../update/update-user/update-user.component';
import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../Interfaces/user.interface';
import {  Router } from '@angular/router';
import { UserService } from '../../Servicios/usuario/user.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../Servicios/perfil/perfil.service';
import { Perfil } from '../../Interfaces/perfil.interface';

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
 
  perfilSevice= inject(PerfilService);

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

  deleteUsuario(){
    if (this.userData) {
      // Asigna la fecha actual al campo deletedAt
      this.userData.deletedAt = new Date();
      // Llama al servicio para actualizar el usuario
      this.userService.updateUser(this.userData).subscribe({
        next: () => {
          console.log('Usuario eliminado exitosamente');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          this.router.navigateByUrl('');
        },
        error: (err: Error) => {
          console.error('Error al actualizar el usuario:', err);
        }
      });
    } else {
      console.error('No se pudo actualizar el usuario: userData es indefinido');
    }
  }

  verificacionEliminacion() {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar la cuenta?",
      text: "¡No podrás revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar a la verificación de la contraseña solo si se confirma la eliminación
        this.verificarPassword().then(() => {
          // Una vez que se haya verificado la contraseña, eliminar el usuario
          this.deleteUsuario();
        }).catch((error) => {
          console.log(error); // Si ocurre algún error en la verificación de la contraseña, no eliminar
        });
      }
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
