import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../../Interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ControlAccesoService {
  private loginStatus: boolean= false; //var que indica si el usuario ha iniciado sesion o no
  private userIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>(''); // Inicialmente vacío
  private url: string= 'http://localhost:3000/users'; 

  constructor( private http: HttpClient) { }

  public getLogginStatus(){
    return this.loginStatus;
  }

  // Obtener el ID del usuario desde el BehaviorSubject
  public getUserId(): Observable<string> {
    return this.userIdSubject.asObservable(); // Nos suscribimos al BehaviorSubject para obtener el ID
  }

  public validarLogin(userEmail: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.url}?email=${userEmail}`).pipe(  // Filtramos por email en el backend
      map(users => {
        const user = users.find(u => u.password === password && !u.deletedAt); // Comprobamos que la contraseña coincida y deletedAt en null
        if (user) {
          if(user.id){
          // Si el usuario es encontrado y la contraseña es correcta
          this.loginStatus = true;// Marcamos que el usuario ha iniciado sesión
          this.userIdSubject.next(user.id); // Actualizamos el BehaviorSubject con el ID
          }
          return user;  // Devolvemos el usuario encontrado
        } else {
          this.loginStatus = false;  // Si no se encuentra el usuario o la contraseña no coincide
          throw new Error('Credenciales incorrectas');
        }
      }),
      catchError(this.manejadorError)  // Manejo de errores
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


  // Cerrar sesión
  public cerrarSesion(): void {
    // Eliminar el token de localStorage
    this.userIdSubject.next(''); // Actualizar el BehaviorSubject con un valor vacío
    this.loginStatus = false; // Cambiamos el estado de login
    console.log('Sesión cerrada correctamente');
  }
 
}
  
