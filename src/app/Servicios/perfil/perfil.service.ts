import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Perfil } from '../../Interfaces/perfil.interface';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
   urlBase=" http://localhost:3000/perfiles";
   
  constructor(private http: HttpClient) { }

  //obtener perfil del usuario, mediante el idUser
  getPerfilByIdUser(idUser:string): Observable<Perfil>{
    return this.http.get<Perfil>(`${this.urlBase}/${idUser}`);
  }

  agregarPerfilByIdUser(perfil:Perfil): Observable<Perfil>{
    return this.http.post<Perfil>(`${this.urlBase}`, perfil);
  }

  actualizarPerfilByIdUser(idUser:string, perfil:Perfil): Observable<Perfil>{
    return this.http.put<Perfil>(`${this.urlBase}/${idUser}`, perfil);
  }

}
