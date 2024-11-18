import { Perfil } from './../../../Interfaces/perfil.interface';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from '../../../Servicios/perfil/perfil.service';
import { ListarProductoComponent } from '../../../componentes/productos/listar-producto/listar-producto.component';
import { MisProductosComponent } from '../mis-productos/mis-productos.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [MisProductosComponent, CommonModule, FormsModule],
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
    telefono: '+542266494325',
    imagePerfil: ''

  };

  nuevaImagen: string = ''; // Para almacenar la nueva URL de la imagen
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

  guardarImagen() {
  Swal.fire({
    title: 'Introduce la URL de la imagen',
    input: 'url',
    inputPlaceholder: 'https://ejemplo.com/imagen.png',
    inputAttributes: {
      'aria-label': 'URL de la imagen'
    },
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    showLoaderOnConfirm: true,
    preConfirm: (url) => {
      if (!url || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(url)) {
        Swal.showValidationMessage('Por favor, introduce una URL válida de imagen.');
        return null; // Devuelve null para detener la ejecución
      }

      // Actualizar el perfil y devolver la promesa
      this.perfilData.imagePerfil = url;
      return this.servicioPerfil.actualizarPerfilByIdUser(this.idUser, this.perfilData).toPromise().catch((error) => {
        console.error(error);
        Swal.showValidationMessage('No se pudo actualizar la imagen. Inténtalo más tarde.');
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Imagen actualizada', 'La imagen de perfil ha sido modificada.', 'success');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Operación cancelada', 'La imagen no ha sido modificada.', 'info');
    }
  }).catch((error) => {
    console.error(error);
    Swal.fire('Error', 'No se pudo procesar la solicitud. Inténtalo más tarde.', 'error');
  });
}

  
  

}
