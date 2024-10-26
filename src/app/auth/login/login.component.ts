import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'; //importamos la clase form builder

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  fb= inject(FormBuilder);// Inyecta el servicio FormBuilder utilizando inject

  loginForm: FormGroup = this.fb.group({//loginForm: FormGroup ->define una propiedad loginForm de tipo FormGroup.
    //this.fb.group(): Usa FormBuilder para crear un grupo de controles de formulario con distintos campos
    
    email: ['', [Validators.required, Validators.email]], // Validaciones: campo 'email' obligatorio y debe tener un formato de correo electrónico válido
    password: ['', Validators.required],// validacion campo 'password' obligatorio
  });

  ngOnInit(): void {//Método que se ejecuta después de la creación del componente.
  
  }

  //metodo login, que se va a llamar cuando el usuario presione el boton de iniciar sesion
  login(){

  }

  
}
