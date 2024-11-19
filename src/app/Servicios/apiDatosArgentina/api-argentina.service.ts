import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { RespuestaProvincias } from '../../Interfaces/respuestaProvincias';

@Injectable({
  providedIn: 'root'
})
export class ApiArgentinaService {
// URL de la API para obtener las provincias
private apiUrl = 'https://apis.datos.gob.ar/georef/api/provincias';

constructor(private http: HttpClient) { }

// Método para obtener provincias
getProvincias(): Observable<any> {
  return this.http.get<any>(this.apiUrl);
}

// Función para obtener el ID de la provincia a partir del nombre
getProvinciaIdByNombre(nombreProvincia: string): Observable<string | null> {
  return this.getProvincias().pipe(
    map((data: RespuestaProvincias) => {
      // Verificamos si la propiedad provincias existe y es un array
      if (data && Array.isArray(data.provincias)) {
        // Buscamos la provincia que coincida con el nombre
        const provincia = data.provincias.find(prov => prov.nombre.toLowerCase() === nombreProvincia.toLowerCase());
        // Retornamos el ID de la provincia o null si no la encontramos
        return provincia ? provincia.id : null;
      } else {
        console.error('Error: No se encontraron provincias o el formato es incorrecto');
        return null;
      }
    }),
    catchError(err => {
      console.error('Error al obtener provincias:', err);
      return of(null); // Devuelve null en caso de error
    })
  );
}


// Método para obtener provincias
getLocalidadesIdProvincia(idProvincia: string): Observable<any> {
  const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${idProvincia}&campos=id,nombre&max=200`;
  return this.http.get<any>(url);
}


}
