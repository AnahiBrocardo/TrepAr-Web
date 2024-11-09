import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../Servicios/usuario/user.service';
import { User } from '../../Interfaces/user.interface';
import { CommonModule } from '@angular/common';

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

 formularioRegistrase= this.fb.nonNullable.group({
  nombre: ['', Validators.required],
  apellido: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
 })

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
          alert('Usuario ya está registrado');
        } else {
          // Si el correo no existe, agregar al nuevo usuario
          this.userService.addUser(newUser).subscribe({
            next: (user) => {
              alert('Registro exitoso. Redirigiendo al inicio de sesión...');
              this.router.navigate(['/login']);
            },
            error: (error) => {
              console.error('Error al registrar al usuario', error);
              alert('Hubo un problema al registrar el usuario. Intenta de nuevo.');
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

}

