import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Perfil } from '../../Interfaces/perfil.interface';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
   urlBase="http://localhost:3003/perfiles";
   
  constructor(private http: HttpClient) { }

  getPerfiles(): Observable<Perfil[]>{
    return this.http.get<Perfil[]>(`${this.urlBase}`);
  }
  //obtener perfil del usuario, mediante el idUser
  getPerfilByIdUser(idUser:string): Observable<Perfil[]>{
    return this.http.get<Perfil[]>(`${this.urlBase}?idUser=${idUser}`);
  }

  agregarPerfil(perfil:Perfil): Observable<Perfil>{
    return this.http.post<Perfil>(`${this.urlBase}`, perfil);
  }

  actualizarPerfilByIdUser(idPerfil:string, perfil:Perfil): Observable<Perfil>{
    return this.http.put<Perfil>(`${this.urlBase}/${idPerfil}`, perfil);
  }

  // Método para verificar si un email ya está en uso
 checkUserNameExists(username: string): Observable<Perfil[]> {
  return this.http.get<Perfil[]>(`${this.urlBase}?username=${username}`);
}

}
