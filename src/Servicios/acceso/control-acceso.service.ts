import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlAccesoService {

  constructor() { }
// creamos el metodo login que se va a conectar con la api rest
  login(credentials:any){
   console.log(credentials);
  }

  }

