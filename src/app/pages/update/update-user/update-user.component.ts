import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../Interfaces/user.interface';
import { UserService } from '../../../Servicios/usuario/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlAccesoService } from '../../../Servicios/auth/control-acceso.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit{
  userId:string='';
  userData?:User;
  userService= inject(UserService);
  controlAccesoService= inject(ControlAccesoService);
  
  isPasswordChangeVisible = false;
  currentPasswordCorrect: boolean = true; // Indicador de si la contraseña es correcta

  fb=inject(FormBuilder);

  formularioUpdateUserData= this.fb.nonNullable.group({
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
      next:(id: string)=>{
        if(id){
          this.userId=id;
          console.log('hola'+this.userId);
          this.usuarioData(this.userId);
        }
      },
      error: (err:Error) => {
        console.error(err);
      }
    })
   
  }

  usuarioData(id:string){
    this.userService.getUserById(id).subscribe({
      next:(user:User)=>{
        this.userData=user;
        this.formularioUpdateUserData.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          password: '******' // Mostrar '******' en lugar de la contraseña real
        });
      },
      error:(e:Error)=>{
        console.log(e);
      }
    })
  }

  togglePasswordChange() {
    this.isPasswordChangeVisible = !this.isPasswordChangeVisible;
  }


  // Validar si la contraseña actual es correcta
  validateCurrentPassword() {
    const currentPassword = this.formularioUpdateUserData.get('currentPassword')?.value;
    // Aquí puedes hacer la llamada al servicio para validar la contraseña
    if(currentPassword){
    this.controlAccesoService.validPassword(this.userData?.email || '', currentPassword).subscribe(isValid => {
      this.currentPasswordCorrect = isValid;
    
      if (!isValid) {
        this.formularioUpdateUserData.get('currentPassword')?.setErrors({ incorrectPassword: true });
      }
    });
  }
  }

  // Validador personalizado para verificar si las contraseñas coinciden
  passwordsMatchValidator(group: FormGroup) {
      // Obtener los valores de las contraseñas
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    // Verificar si las contraseñas coinciden
  if (password && confirmPassword && password === confirmPassword) {
    return null;  // No hay error, las contraseñas coinciden
  }

  // Si las contraseñas no coinciden, retornar un objeto de error
  return { passwordMismatch: true };  // Se agrega un error llamado 'passwordMismatch'
  }

  
}
