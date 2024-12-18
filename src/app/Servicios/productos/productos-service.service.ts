import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductoInterface, UsuariosxProductos } from '../../Interfaces/producto-interface';


@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {

  constructor(private http: HttpClient) { }

  urlBase: string = 'http://localhost:3002/productos'

  getAllProductos(): Observable <ProductoInterface[]>{
    return this.http.get<ProductoInterface[]>(`${this.urlBase}`);  
  }

getProductos(idUsuario: string): Observable <ProductoInterface[]>{
  return this.http.get<ProductoInterface[]>(`${this.urlBase}?idUser=${idUsuario}`);  
}

getProductoById(id:string | null): Observable<ProductoInterface>{
  return this.http.get<ProductoInterface>(`${this.urlBase}/${id}`)
}

postProductos(producto: ProductoInterface): Observable<ProductoInterface>{
  return this.http.post<ProductoInterface>(`${this.urlBase}`, producto);
}

putProductos(id:string | undefined, producto: ProductoInterface): Observable<ProductoInterface> {
return this.http.put<ProductoInterface>(`${this.urlBase}/${producto.id}`, producto)
}

deleteProductosbyId (id: string | undefined): Observable<ProductoInterface>{
  return this.http.delete<ProductoInterface>(`${this.urlBase}/${id}`);
}

deleteAllProductosByUserId(idUsuario: string): Observable<void> {
  return this.getProductos(idUsuario).pipe(
    map((productos) => {
      // Eliminamos cada producto de forma individual
      productos.forEach(producto => {
        this.deleteProductosbyId(producto.id).subscribe();
      });
    })
  );
}

}