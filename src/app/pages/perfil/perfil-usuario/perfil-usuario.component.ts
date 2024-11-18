import { Perfil } from './../../../Interfaces/perfil.interface';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from '../../../Servicios/perfil/perfil.service';
import { ListarProductoComponent } from '../../../componentes/productos/listar-producto/listar-producto.component';
import { MisProductosComponent } from '../mis-productos/mis-productos.component';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [MisProductosComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit {
  activated= inject(ActivatedRoute);
  idUser: string='';
  perfilData: Perfil = {
    idUser: '',
    userName: 'Mosai',
    descripcion: 'Emprendimiento de jabones artesanales',
    pais: 'Argentina',
    ciudad: 'Mar del Plata',
    linkInstagram: '',
    linkLinkedIn: 'https://www.linkedin.com/in/anahi-brocardo/',
    linkWeb: '',
    telefono: '+542266494325'
  };
  servicioPerfil= inject(PerfilService);

  ngOnInit(): void {
    this.activated.paramMap.subscribe({
     next:(param)=>{
       const id= param.get('id');
       if(id){
         this.idUser=id;
         console.log("idUser asignado:", id);
         this.perfilData.idUser= id;
       // this.obtenerDatosPerfil(this.idUser);
       }
     }
    })
   }


   obtenerDatosPerfil(id: string){
   this.servicioPerfil.getPerfilByIdUser(id).subscribe({
    next:(perfil:Perfil)=>{
     this.perfilData= perfil;
    },
    error:(e:Error)=>{
      console.log(e);
    }
   })
   }
}
