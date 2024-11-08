import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LoginRequest } from '../../Interfaces/loginRequest.interface';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../Interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ControlAccesoService {
  usuarioActualLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); //valor por defecto false, el usuario no va a estar logueado inicialmente
  dataUsuarioActual: BehaviorSubject<User>= new BehaviorSubject<User>({id:0, email:''}); 

  constructor( private http: HttpClient) { }

// Creamos el método `login` que se conectará con la API REST.
// Este método recibe un parámetro `credentials` que debe cumplir con la interfaz `loginRequest`.
  login(credentials: LoginRequest ): Observable <User>{ 
    return this.http.get<User>('http://localhost:3000/user').pipe(
      tap((userData: User) =>{ //tap permite realizar acciones secundarias sin alterar el flujo de datos.En este caso se utiliza para actualizar estados o variables con los datos obtenidos.
        console.log('Datos del usuario recibidos en login:', userData); 
        this.dataUsuarioActual.next(userData); // se actualiza el observable `dataUsuarioActual` con los datos del usuario que acaba de iniciar sesión.
        this.usuarioActualLoginOn.next(true); //se cambia el estado de `usuarioActualLoginOn` a `true` para indicar que el usuario ha iniciado sesión 
      }),
      catchError(this.manejadorError) //si algo sale mal con la solicitud al servidor, catchError llama a manejadorError para que maneje el problema
    );
   }
 
   private manejadorError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error del lado del cliente o problema de red
      console.error('Se ha producido un error de red o cliente:', error.error);
    } else {
      // Error del backend, el código de estado indica el problema
      switch (error.status) {
        case 400:
          console.error('Solicitud incorrecta (400):', error.error);
          break;
        case 401:
          console.error('No autorizado (401):', error.error);
          break;
        case 404:
          console.error('Recurso no encontrado (404):', error.error);
          break;
        case 500:
          console.error('Error interno del servidor (500):', error.error);
          break;
        default:
          console.error(`Backend retornó el código de estado ${error.status}:`, error.error);
      }
    }
    
    // se lanza un error genérico
    return throwError(() => new Error('Algo falló. Por favor, intenta nuevamente...'));
  }
 
  get userData(): Observable<User>{
    return this.dataUsuarioActual.asObservable();
  }

  get userLoginOn(): Observable<boolean>{
    return this.usuarioActualLoginOn.asObservable();
  }
  }
