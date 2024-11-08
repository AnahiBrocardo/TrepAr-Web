import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlAccesoService } from '../../Servicios/auth/control-acceso.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginError: string="";

  fb= inject(FormBuilder);
  loginService= inject(ControlAccesoService);
  router= inject(Router);
  
    ngOnInit(): void {
    }

    formularioLogin= this.fb.nonNullable.group({//para crear un grupo de controles de formulario con distintos campos
      email: ['', [Validators.required, Validators.email]], // Validaciones: campo 'email' obligatorio y debe tener un formato de correo electrónico válido
      password: ['', Validators.required],// validacion campo 'password' obligatorio

    })

    get email(): AbstractControl | null {//siempre puede acceder a cualquier control de formulario a través del metodo get 
      return this.formularioLogin.get('email');//Devuelve el control email si existe o null
    }
     
      /*AbstractControl | null ->es el tipo de retorno, esta función puede devolver un objeto de tipo AbstractControl
   o null. AbstractControl es una clase de Angular que representa un control en un formulario reactivo  */
  
  get password(): AbstractControl | null {
    return this.formularioLogin.get('password');
  }

  //metodo login, que se va a llamar cuando el usuario presione el boton de iniciar sesion
  login(){
    
    if(this.formularioLogin.valid){ //si el formulario es valido
    // Obtén los valores del formulario en variables
    const emailForm = this.formularioLogin.get('email')?.value;
    const passwordForm = this.formularioLogin.get('password')?.value;

    // Verifica que ambos valores no sean nulos o undefined
    if (emailForm && passwordForm) {
    this.loginService.login({ email: emailForm, password: passwordForm }).subscribe({ //lamamos a servicio, pansandole por parametro los datos del formulario
      next: (userData)=> {//se ejecuta cada vez que el Observable emite un valor
        console.log(userData);
      },
      error: (errorData)=> {
      console.error(errorData);
      this.loginError=errorData;
      },
      complete: ()=>{ //se ejecuta cuando el Observable termina su ejecución sin errores
        console.log("Login completo");
        this.router.navigateByUrl('/dashboard');// Redirige al usuario a la ruta '/dashboard' utilizando el método navigateByUrl
        this.formularioLogin.reset();//reseteamos los campos del form
      }
    });
    
    
  }else{

      this.formularioLogin.markAllAsTouched();// Marca todos los controles del formulario como 'touched', es decir, se considera que el usuario ha interactuado con ellos.
    alert("Error al ingresar los datos");
  }
  }
}

  }
