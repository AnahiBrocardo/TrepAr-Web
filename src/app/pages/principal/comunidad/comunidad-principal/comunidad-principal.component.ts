import { Component, inject, Input, OnInit } from '@angular/core';
import { Perfil } from '../../../../Interfaces/perfil.interface';
import { PerfilService } from '../../../../Servicios/perfil/perfil.service';
import { CommonModule } from '@angular/common';
import { BarraBusquedaPrincipalComponent } from '../../barra-busqueda-principal/barra-busqueda-principal.component';
import { PerfilComunidadComponent } from '../../perfil-comunidad/perfil-comunidad/perfil-comunidad.component';

@Component({
  selector: 'app-comunidad-principal',
  standalone: true,
  imports: [CommonModule, BarraBusquedaPrincipalComponent,PerfilComunidadComponent],
  templateUrl: './comunidad-principal.component.html',
  styleUrl: './comunidad-principal.component.css'
})
export class ComunidadPrincipalComponent implements OnInit{
  @Input()
  userId?:string;


  visibilidadComunidad:boolean=true;
  perfilSeleccionadoId:string='';

  perfiles: Perfil[]=[

  ];

  perfilService= inject(PerfilService);

  ngOnInit(): void {
    this.perfilService.getPerfiles().subscribe({
      next: (perfiles: Perfil[])=>{
         // Filtrar los perfiles para excluir el perfil con idUser igual a this.idUser
         this.perfiles = perfiles.filter(perfil => perfil.idUser !== this.userId);
      },
      error:(e:Error)=>{
        console.log(e);
      }
    })
    console.log(this.visibilidadComunidad);
  }

  seleccionPerfil(perfilSeleccionadoId:string){

    this.visibilidadComunidad=!this.visibilidadComunidad;

    if(perfilSeleccionadoId){
      this.perfilSeleccionadoId=perfilSeleccionadoId;
    }
    
  }

  cambiarVisibilidad(){
    this.visibilidadComunidad=!this.visibilidadComunidad;
  }
}

