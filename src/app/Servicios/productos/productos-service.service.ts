import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoInterface } from '../../Interfaces/producto-interface';


@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {

  constructor(private http: HttpClient) { }

  urlBase: string = 'http://localhost:3000/productos'

  getProductos(): Observable <ProductoInterface[]>{
    return this.http.get<ProductoInterface[]>(this.urlBase)
  }

  postProductos(producto: ProductoInterface): Observable<ProductoInterface>{
    return this.http.post<ProductoInterface>(this.urlBase, producto)
  }

  putProductos(producto: ProductoInterface, id: number): Observable<ProductoInterface> {
    return this.http.put<ProductoInterface>(`${this.urlBase}/${id}`, producto)
  }
}