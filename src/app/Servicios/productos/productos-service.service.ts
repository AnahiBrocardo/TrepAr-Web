import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoInterface, UsuariosxProductos } from '../../Interfaces/producto-interface';


@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {

  constructor(private http: HttpClient) { }

  urlBase: string = 'http://localhost:3000/productos'

  getProductos(): Observable <UsuariosxProductos[]>{
    return this.http.get<UsuariosxProductos[]>(this.urlBase)
  }

  getProductoPorId(id: string): Observable<UsuariosxProductos> {
    return this.http.get<UsuariosxProductos>(`${this.urlBase}/${id}`);
  }

  postProductos(producto: UsuariosxProductos): Observable<UsuariosxProductos>{
    return this.http.post<UsuariosxProductos>(this.urlBase, producto)
  }

  putProductos(producto: UsuariosxProductos, id: number): Observable<UsuariosxProductos> {
    return this.http.put<UsuariosxProductos>(`${this.urlBase}/${id}`, producto)
  }
}