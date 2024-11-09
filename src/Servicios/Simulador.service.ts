
import { Simulador } from '../app/componentes/simulador/InterfaceSim/Simulador.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SimuladorService {
 //opcion de injeccion:  http2 = inject(HttpClient)
  
 constructor(private http: HttpClient) { }

 urlBase: string = 'http://localhost:3000/simuladores'

 getSimulador(): Observable<Simulador[]> {
  return this.http.get<Simulador[]>(this.urlBase)
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

putSimulador(id: number | null, Simulador: Simulador): Observable<Simulador> {
  return this.http.put<Simulador>(`${this.urlBase}/${id}`, Simulador)
}
}
