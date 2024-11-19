import { Perfil } from './../../../Interfaces/perfil.interface';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from '../../../Servicios/perfil/perfil.service';
import { ListarProductoComponent } from '../../../componentes/productos/listar-producto/listar-producto.component';
import { MisProductosComponent } from '../mis-productos/mis-productos.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [MisProductosComponent, CommonModule, FormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit {
  activated= inject(ActivatedRoute);

  isLoading: boolean = true;
  idUser: string='';
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
  

   guardarImagen() { //ver porque fallla!!!
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
      preConfirm: async (url) => {
        // Validar la URL ingresada
        if (!url || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(url)) {
          Swal.showValidationMessage('Por favor, introduce una URL válida de imagen.');
          return Promise.reject(); // Detener ejecución si la URL no es válida
        }
  
        // Asegurarse de que los datos del perfil están cargados
        if (!this.perfilData) {
          Swal.showValidationMessage('Datos de perfil no disponibles.');
          return Promise.reject(); // Detener ejecución si no hay datos del perfil
        }
  
        try {
          // Actualizar la imagen en el perfil
          this.perfilData.imagePerfil = url;
          await lastValueFrom(this.servicioPerfil.actualizarPerfilByIdUser(this.idUser, this.perfilData));
        } catch (error) {
          console.error('Error al actualizar la imagen:', error);
          Swal.showValidationMessage('No se pudo actualizar la imagen. Inténtalo más tarde.');
          return Promise.reject(); // Detener ejecución si falla la actualización
        }
      }
    }).then((result) => {
      // Si el usuario confirma, mostrar mensaje de éxito
      if (result.isConfirmed) {
        Swal.fire('Imagen actualizada', 'La imagen de perfil ha sido modificada.', 'success');
      } 
      // Si el usuario cancela, mostrar mensaje de cancelación
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Operación cancelada', 'La imagen no ha sido modificada.', 'info');
      }
    }).catch((error) => {
      // Manejar errores globales (opcional)
      console.error('Error general:', error);
      Swal.fire('Error', 'No se pudo procesar la solicitud. Inténtalo más tarde.', 'error');
    });
  }
  
}
