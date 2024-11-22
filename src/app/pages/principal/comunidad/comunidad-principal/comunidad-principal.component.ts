import { Component, inject, Input, OnInit } from '@angular/core';
import { Perfil } from '../../../../Interfaces/perfil.interface';
import { PerfilService } from '../../../../Servicios/perfil/perfil.service';
import { CommonModule } from '@angular/common';
import { BarraBusquedaPrincipalComponent } from '../../barra-busqueda-principal/barra-busqueda-principal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comunidad-principal',
  standalone: true,
  imports: [CommonModule, BarraBusquedaPrincipalComponent],
  templateUrl: './comunidad-principal.component.html',
  styleUrl: './comunidad-principal.component.css'
})
export class ComunidadPrincipalComponent implements OnInit{
  @Input()
  userId?:string;

  router= inject(Router);

  // Propiedades para almacenar los datos recibidos de la barra de busqueda
  textoBusqueda: string = '';
  filtro: string = 'emprendedores';
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
  }

  seleccionPerfil(perfilSeleccionadoId:string){
    localStorage.setItem('idPerfilSeleccionado', perfilSeleccionadoId);
    this.router.navigateByUrl('dashboard/comunidad/perfil');
  }
}
