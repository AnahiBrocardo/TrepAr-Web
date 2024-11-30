
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Simulador } from '../../Interfaces/Simulador.interface';


@Injectable({
  providedIn: 'root'
})
export class SimuladorService {
 //opcion de injeccion:  http2 = inject(HttpClient)
  
 constructor(private http: HttpClient) { }

 urlBase: string = 'http://localhost:3001/simuladores'

getSimulador(idUsuario: string): Observable<Simulador[]> {
  return this.http.get<Simulador[]>(`${this.urlBase}?idUsuario=${idUsuario}`);
}

postSimulador(Simulador: Simulador): Observable<Simulador> {
  return this.http.post<Simulador>(this.urlBase, Simulador)
}

getSimuladorById(id: number | null): Observable<Simulador> {
  return this.http.get<Simulador>(`${this.urlBase}/${id}`)
}

deleteSimulador(id: number | undefined): Observable<Simulador> {
  return this.http.delete<Simulador>(`${this.urlBase}/${id}`)
}

putSimulador(id: string | null, Simulador: Simulador): Observable<Simulador> {
  return this.http.put<Simulador>(`${this.urlBase}/${id}`, Simulador)
}
}
