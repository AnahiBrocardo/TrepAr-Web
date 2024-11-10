import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../Interfaces/user.interface';
import { UserService } from '../../../Servicios/usuario/user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlAccesoService } from '../../../Servicios/auth/control-acceso.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit{
  userId:string='';
  userData?:User;
  userService= inject(UserService);
  controlAccesoService= inject(ControlAccesoService);

  fb=inject(FormBuilder);

  formularioUpdateUserData= this.fb.nonNullable.group({
  nombre: ['', Validators.required],
  apellido: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['******', [Validators.required, Validators.minLength(8)]]
  })

  ngOnInit(): void {
    this.controlAccesoService.getUserId().subscribe({
      next:(id: string)=>{
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

  
}
