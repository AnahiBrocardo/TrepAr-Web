
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComunidadPrincipalComponent } from '../comunidad/comunidad-principal/comunidad-principal.component';
import { BarraBusquedaPrincipalComponent } from '../barra-busqueda-principal/barra-busqueda-principal.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [ComunidadPrincipalComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit{
 userId?:string;
 activated= inject(ActivatedRoute);

  ngOnInit(): void {
    this.activated.paramMap.subscribe({
      next:(param)=>{
        const id= param.get('id');
        if(id){
          this.userId=id;
        }
      }
     })
     console.log('user id'+this.userId);
  }


  

}
