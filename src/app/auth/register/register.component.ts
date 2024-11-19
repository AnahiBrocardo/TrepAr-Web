import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../Servicios/usuario/user.service';
import { User } from '../../Interfaces/user.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 fb= inject(FormBuilder);
 router= inject(Router);
 userService= inject(UserService);
 isPasswordVisible = false; // Controla la visibilidad de la contraseña
  showProfileForm: boolean = false;// Variable para controlar la visibilidad del formulario de perfil

 formularioRegistrase= this.fb.nonNullable.group({
  nombre: ['', Validators.required],
  apellido: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
 })

 // Formulario de perfil
 formularioPerfil = this.fb.group({
  username:['', [Validators.required,Validators.minLength(3), Validators.maxLength(20)]],
  descripcion: ['', [Validators.required]],
  pais: ['', [Validators.required]],
  ciudad: ['', [Validators.required]],
  linkInstagram:[''],
  linkLinkedIn: [''],
  linkWeb: [''],
  telefono: [''],
  imagePerfil:['']

});


 signIn() {
  if (this.formularioRegistrase.invalid) {
    return;
  }

  const formValue = this.formularioRegistrase.value;

  // Convertir el valor del formulario a un objeto User
  const newUser: User = {
    nombre: formValue.nombre,
    apellido: formValue.apellido,
    email: formValue.email ?? '', // Si formValue.email es undefined, asigna una cadena vacía
    password: formValue.password ?? '',
    createdAt: new Date(),
    deletedAt: null
  };

  const userEmail = this.formularioRegistrase.get('email')?.value;

  if (userEmail) {
    // Obtener los usuarios existentes
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        // Verificar si el correo electrónico ya está registrado
        if (this.emailExists(users, userEmail)) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El usuario ya está registrado",
          });
        } else {
          // Si el correo no existe, agregar al nuevo usuario
          this.userService.addUser(newUser).subscribe({
            next: (user) => {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Registro exitoso."
              });
              this.router.navigate(['/acceso']);
            },
            error: (error) => {
              console.error('Error al registrar al usuario', error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Hubo un problema al registrar el usuario. Intenta de nuevo",
              });
            }
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener los usuarios', error);
      }
    });
  }
}

// Método que verifica si el correo ya existe en el array de usuarios
private emailExists(users: User[], email: string): boolean {
  return users.some(user => user.email === email);
}
togglePasswordVisibility() {
  this.isPasswordVisible = !this.isPasswordVisible;
}
}

