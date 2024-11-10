import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../Interfaces/user.interface';
import { UserService } from '../../../Servicios/usuario/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlAccesoService } from '../../../Servicios/auth/control-acceso.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
  userId: string = '';
  userData?: User;
  userService = inject(UserService);
  controlAccesoService = inject(ControlAccesoService);
  isPasswordVisible = false; // Controla la visibilidad de la contraseña
  isPasswordChangeVisible = false;
  currentPasswordCorrect: boolean = true; // Indicador de si la contraseña es correcta

  fb = inject(FormBuilder);

  formularioUpdateUserData = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', Validators.minLength(8)],
    confirmPassword: ['', Validators.minLength(8)],
    currentPassword: ['', Validators.required] // Para la contraseña actual
  });

  ngOnInit(): void {
    this.controlAccesoService.getUserId().subscribe({
      next: (id: string) => {
        if (id) {
          this.userId = id;
          this.usuarioData(this.userId);
        }
      },
      error: (err: Error) => {
        console.error(err);
      }
    });
  }

  usuarioData(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.userData = user;
        this.formularioUpdateUserData.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          password: user.password
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

  // Validar si la contraseña actual es correcta
  validateCurrentPassword() {
    const currentPassword = this.formularioUpdateUserData.get('currentPassword')?.value;

    if (currentPassword) {
      this.controlAccesoService.validPassword(this.userData?.email || '', currentPassword).subscribe({
        next: (isValid) => {
          this.currentPasswordCorrect = isValid;

          if (!isValid) {
            this.formularioUpdateUserData.get('currentPassword')?.setErrors({ incorrectPassword: true });
          }
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  actualizarDatos() {
    if(this.isPasswordChangeVisible){
      this.validateCurrentPassword();
      // Si la contraseña actual es incorrecta, no procedemos
    if (!this.currentPasswordCorrect) {
      return;
    } 
    }
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
      next: (existingUser: User | null) => {
        if (existingUser && existingUser.id !== this.userId) {
          // Si el email ya está en uso por otro usuario, mostramos un error
          this.formularioUpdateUserData.get('email')?.setErrors({ emailExists: true }); // error personalizado
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
    const currentPassword = this.formularioUpdateUserData.get('currentPassword')?.value;
    const newPassword = this.formularioUpdateUserData.get('newPassword')?.value;
    const confirmPassword = this.formularioUpdateUserData.get('confirmPassword')?.value;

    // Primero, verificamos que la contraseña actual coincida con la contraseña de la base de datos
    if (currentPassword && this.userData?.password) {
      if (currentPassword !== this.userData.password) {
        // Si la contraseña no coincide con la de la base de datos, mostramos un error
        this.formularioUpdateUserData.get('currentPassword')?.setErrors({ incorrectPassword: true });
        return; // Salimos de la función si la contraseña es incorrecta
      }
    }
    // Luego, verificamos si las contraseñas coinciden
    if (newPassword && newPassword !== confirmPassword) {
      // Si las contraseñas no coinciden, mostramos un error
      this.formularioUpdateUserData.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      // Si las contraseñas coinciden o no se cambiaron, proceder a actualizar el usuario
      this.actualizarUsuario();
    }
  }

  // Método para preparar los datos del usuario y enviarlos al servicio
  private actualizarUsuario() {
    const nombre = this.formularioUpdateUserData.get('nombre')?.value;
    const apellido = this.formularioUpdateUserData.get('apellido')?.value;
    const email = this.formularioUpdateUserData.get('email')?.value;
    const password = this.formularioUpdateUserData.get('password')?.value;
    const newPassword = this.formularioUpdateUserData.get('newPassword')?.value;

    if (email && newPassword) {
      const updatedUser: User = {
        nombre: nombre || ' ',
        apellido: apellido || ' ',
        email: email || ' ',
        password: newPassword || '' // Usar la nueva contraseña si fue modificada
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Datos actualizados exitosamente');
        },
        error: (err: Error) => {
          console.error('Error al actualizar datos:', err);
        }
      });
    }
  }

  pedirContraseñaYActualizar() {
    // Usar SweetAlert2 para pedir la contraseña nuevamente
    Swal.fire({
      title: "Por favor vuelva a ingresar su contraseña",
      input: "password",
      inputLabel: "Contraseña",
      inputPlaceholder: "Ingresa tu contraseña",
      inputAttributes: {
        maxlength: "10",
        autocapitalize: "off",
        autocorrect: "off"
      }
    }).then(({ value: password }) => {
      if (password) {
        // Verificar si la contraseña ingresada es correcta
        this.controlAccesoService.validPassword(this.userData?.email || '', password).subscribe({
          next: (isValid) => {
            if (isValid) {
              // Si la contraseña es válida, proceder con la actualización de los datos
              this.actualizarUsuario();
            } else {
              // Si la contraseña es incorrecta, mostrar un error
              Swal.fire('Error', 'La contraseña ingresada no es correcta');
            }
          },
          error: (err: Error) => {
            console.error("Error al verificar la contraseña:", err);
          }
        });
      } else {
        // Si no se ingresa contraseña, mostrar un error
        Swal.fire('Error', 'La contraseña es requerida');
      }
    });
  }
}
