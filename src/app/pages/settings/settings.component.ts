import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../Interfaces/user.interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../Servicios/usuario/user.service';
import { UpdateUserComponent } from '../update/update-user/update-user.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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

  activated= inject(ActivatedRoute);
  userId: string='';

  ngOnInit(): void {
   this.activated.paramMap.subscribe({
    next:(param)=>{
      const id= param.get('id');
      if(id){
        this.userId=id;
      }
    }
   })
   this.usuarioData(this.userId);
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
          },
          error: (err: Error) => {
            console.error('Error al actualizar el usuario:', err);
          }
        });
      } else {
        console.error('No se pudo actualizar el usuario: userData es indefinido');
      }
    }
  

  verificacionEliminacion(){
    Swal.fire({
      title: "Estas seguro que deseas eliminar la cuenta",
      text: "No podras revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
       this.verificarPassword();
        Swal.fire({
          title: "Cuenta eliminada",
          text: "",
          icon: "success"
        });
        this.router.navigateByUrl('');
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
      this.deleteUsuario(); 
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


