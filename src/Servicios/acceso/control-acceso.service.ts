import { Injectable } from '@angular/core';
import { loginRequest } from '../../Interfaces/loginRequest';

@Injectable({
  providedIn: 'root'
})
export class ControlAccesoService {

  constructor() { }
// Creamos el método `login` que se conectará con la API REST.
// Este método recibe un parámetro `credentials` que debe cumplir con la interfaz `loginRequest`.
  login(credentials:loginRequest){ 
   console.log(credentials);
  }

  }

