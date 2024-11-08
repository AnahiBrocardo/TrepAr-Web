import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../Interfaces/loginRequest.interface';
import { Observable } from 'rxjs';
import { User } from '../../Interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ControlAccesoService {

  constructor( private http: HttpClient) { }

// Creamos el método `login` que se conectará con la API REST.
// Este método recibe un parámetro `credentials` que debe cumplir con la interfaz `loginRequest`.
  login(credentials: LoginRequest ): Observable <User>{ 
    return this.http.get<User>('http://localhost:3000/usuarios');
   }
 
 

  }
