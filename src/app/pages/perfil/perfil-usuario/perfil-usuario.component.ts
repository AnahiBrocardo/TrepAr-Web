import { Perfil } from './../../../Interfaces/perfil.interface';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from '../../../Servicios/perfil/perfil.service';
import { MisProductosComponent } from '../mis-productos/mis-productos.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [MisProductosComponent, CommonModule, FormsModule, EditarPerfilComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit {
  activated= inject(ActivatedRoute);

  isLoading: boolean = true;
  idUser: string='';
  vistaPerfil: boolean=false;
  perfilData?: Perfil;

  private cdr = inject(ChangeDetectorRef);
  nuevaImagen: string = ''; // Para almacenar la nueva URL de la imagen
  servicioPerfil= inject(PerfilService);

  ngOnInit(): void {
    this.activated.paramMap.subscribe({
     next:(param)=>{
       const id= param.get('id');
       if(id){
         this.idUser=id;
        this.obtenerDatosPerfil(this.idUser);
       }
     }
    })
   }


   obtenerDatosPerfil(id: string) {
    this.servicioPerfil.getPerfilByIdUser(id).subscribe({
      next: (perfilArray: Perfil[]) => {
        if (perfilArray.length > 0) {
          this.perfilData = perfilArray[0]; // Acceder al primer elemento del array
          console.log(this.perfilData);
        } else {
          console.error('El perfil no existe o no se encontró.');
        }
      },
      error: (e: Error) => {
        console.error('Error al obtener el perfil:', e);
      }
    });
  }
  

  editarPerfil(){
   this.vistaPerfil=!this.vistaPerfil;
  }
}
