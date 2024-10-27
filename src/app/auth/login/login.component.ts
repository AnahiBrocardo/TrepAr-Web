import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'; //importamos la clase form builder
import { Router } from '@angular/router';
import { ControlAccesoService } from '../../../Servicios/acceso/control-acceso.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
 loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: ControlAccesoService){

   this.loginForm= this.formBuilder.group({//loginForm: FormGroup ->define una propiedad loginForm de tipo FormGroup.
      //this.fb.group(): Usa FormBuilder para crear un grupo de controles de formulario con distintos campos
      
      email: ['', [Validators.required, Validators.email]], // Validaciones: campo 'email' obligatorio y debe tener un formato de correo electrónico válido
      password: ['', Validators.required],// validacion campo 'password' obligatorio
    });
  }
 

  ngOnInit(): void {//Método que se ejecuta después de la creación del componente.
  
  }


  get email(): AbstractControl | null {//siempre puede acceder a cualquier control de formulario a través del metodo get 
    return this.loginForm.get('email');//Devuelve el control email si existe o null
  }

  /*AbstractControl | null ->es el tipo de retorno, esta función puede devolver un objeto de tipo AbstractControl
   o null. AbstractControl es una clase de Angular que representa un control en un formulario reactivo  */
  
  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  //metodo login, que se va a llamar cuando el usuario presione el boton de iniciar sesion
  login(){
    
    if(this.loginForm.valid){ //si el formulario es valido

    this.loginService.login(this.loginForm.value).subscribe({
      next: (userData)=> {
        console.log(userData);
      },
      error: (errorData)=> {
       console.error(errorData);
      },
      complete: ()=>{
        console.log("Login completo");
      }
    }); //lamamos a servicio, pansandole por parametro los datos del formulario
    this.router.navigateByUrl('/dashboard');// Redirige al usuario a la ruta '/dashboard' utilizando el método navigateByUrl
    this.loginForm.reset();//reseteamos los campos del form
    
  }else{

      this.loginForm.markAllAsTouched();// Marca todos los controles del formulario como 'touched', es decir, se considera que el usuario ha interactuado con ellos.
    alert("Error al ingresar los datos");
  }
  }

  
}
