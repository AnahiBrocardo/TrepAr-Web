import { Component, inject, Input, OnInit } from '@angular/core';
import { User } from '../../../Interfaces/user.interface';
import { UserService } from '../../../Servicios/usuario/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlAccesoService } from '../../../Servicios/auth/control-acceso.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
  userData?: User;
  userService = inject(UserService);
  controlAccesoService = inject(ControlAccesoService);
  isPasswordVisible = false; // Controla la visibilidad de la contraseña
  isPasswordChangeVisible = false;
  currentPasswordCorrect: boolean = true; // Indicador de si la contraseña es correcta
  password: string = ''; // Aquí deberías asignar el valor real de la contraseña

  @Input() 
  userId?: string // Recibe el userId del componente padre

  fb = inject(FormBuilder);
  router=inject(Router);

  formularioUpdateUserData = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    repiteNewPassword: ['', [Validators.required, Validators.minLength(8)]],
  });



  ngOnInit(): void {
    if(this.userId){
      this.usuarioData(this.userId);
    }
              
  }

  usuarioData(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.userData = user;
        this.password= user.password;
        this.formularioUpdateUserData.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email
        });
      },
      error: (e: Error) => {
        console.log(e);
      }
    });
  }

  togglePasswordChange() {
    this.isPasswordChangeVisible = !this.isPasswordChangeVisible;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  actualizarDatos() {
     const email = this.formularioUpdateUserData.get('email')?.value; //se obtiene el email del form

      if (email && email !== this.userData?.email) {
        // Verificar si el email ya está en uso y no pertenece al usuario actual
        this.verificarEmailUnico(email);
      } else {
        // Si el email no cambió, validar contraseñas y actualizar datos
        this.validarYActualizarUsuario();
      }
    }


  // Método para verificar si el email ya está en uso
  private verificarEmailUnico(email: string) {
    this.userService.checkEmailExists(email).subscribe({
      next: (existingUsers) => {
        const existingUser= existingUsers[0];

        if (existingUser && existingUser.id !== this.userId) {
          // Si el email ya está en uso por otro usuario, mostramos un error
          Swal.fire("El email ingresado ya esta en uso");
        } else {
          // Si el email es único o pertenece al usuario actual, se valida el resto de los campos
          this.validarYActualizarUsuario();
        }
      },
      error: (err: Error) => {
        console.error('Error al verificar el email:', err);
      }
    });
  }

  // Método para validar contraseñas y actualizar usuario
  private validarYActualizarUsuario() {
    if(this.isPasswordChangeVisible){
      const newPasswordRepeted = this.formularioUpdateUserData.get('repiteNewPassword')?.value;
      const newPassword = this.formularioUpdateUserData.get('newPassword')?.value;
      
      // Verificar si las contraseñas coinciden
    if (newPasswordRepeted !== newPassword) {
      Swal.fire("Las contraseñas no coinciden");
      return; // Salimos si no coinciden
    }
    this.pedirContraseñaYActualizar();
    }else{
      this.pedirContraseñaYActualizar();
    }
   
  }

  // Método para preparar los datos del usuario y enviarlos al servicio
  private actualizarUsuario() {

    const nombre = this.formularioUpdateUserData.get('nombre')?.value;
    const apellido = this.formularioUpdateUserData.get('apellido')?.value;
    const email = this.formularioUpdateUserData.get('email')?.value;
    const newPassword = this.formularioUpdateUserData.get('newPassword')?.value;

    let contrasenia: string='';
    if(newPassword){
      contrasenia= newPassword;
    }else{
      if(this.userData?.password){
      contrasenia= this.userData?.password;}
    }

    if (email && contrasenia) {
      const updatedUser: User = {
        id:this.userId,
        nombre: nombre || ' ',
        apellido: apellido || ' ',
        email: email || ' ',
        password: contrasenia// Usar la nueva contraseña si fue modificada
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          location.reload();
        },
        error: (err: Error) => {
          console.error('Error al actualizar datos:', err);
        }
      });
    }
  }

  
async pedirContraseñaYActualizar() {
  try {
    const result = await Swal.fire({
      title: "Ingrese contraseña actual, para guardar los cambios...",
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
                  // Si la contraseña es válida, proceder con la actualización de los datos
                  resolve(password);  // Asegúrate de resolver la promesa si la contraseña es correcta
                  
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
      this.actualizarUsuario();  // Realizar la actualización del usuario
      Swal.fire({
        title: `Cambios guardados exitosamente`,
        text: `Los datos han sido actualizados correctamente.`
      });
      this.router.navigateByUrl(`dashboard/settings`);
    }
  } catch (error) {
    Swal.showValidationMessage(`Solicitud fallida: ${error}`);
  }
}
}