import { Injectable } from '@angular/core';
import { loginRequest } from '../../Interfaces/loginRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlAccesoService {

  constructor( private http: HttpClient) { }

// Creamos el método `login` que se conectará con la API REST.
// Este método recibe un parámetro `credentials` que debe cumplir con la interfaz `loginRequest`.
  login(credentials:loginRequest): Observable <any>{ 
   return this.http.get('http://localhost:3000/usuarios');
  }

  }

