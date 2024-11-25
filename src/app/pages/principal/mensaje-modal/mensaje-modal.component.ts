import { Chat } from './../../../Interfaces/chat';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../../Servicios/chatInterno/chat.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PerfilService } from '../../../Servicios/perfil/perfil.service';
import { Perfil } from '../../../Interfaces/perfil.interface';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog'; // Para el cuadro de diálogo
import { MatFormFieldModule } from '@angular/material/form-field'; // Para los campos de formulario estilizados
import { MatInputModule } from '@angular/material/input'; // Para los inputs y textarea
import { MatButtonModule } from '@angular/material/button'; // Para los botones
import { MatIconModule } from '@angular/material/icon'; // Para usar iconos (opcional)
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mensaje-modal',
  standalone: true,
  imports: [ 
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './mensaje-modal.component.html',
  styleUrl: './mensaje-modal.component.css'
})
export class MensajeModalComponent implements OnInit{
  fb= inject(FormBuilder);
  ChatService = inject(ChatService);
  tipo: string = '';
  perfilSeleccionado?:Perfil;
  perfilService= inject(PerfilService);
  idDestino :string='';
  idUsuario:string='';
  destinatarioName: string = '';

  constructor( private dialogRef: MatDialogRef<MensajeModalComponent>,
    @Inject(MAT_DIALOG_DATA)public data: any){
  
  //  this.userId=data.idUsuario;
   //  this.tipo = data.tipo;
   //  this.perfilSeleccionadoIdPerfil= data.idDestino
  }

  
  ngOnInit(): void {
    if (this.data) {
      this.tipo = this.data.tipo || '';
      this.idUsuario = this.data.idUsuario || '';
      this.idDestino = this.data.idDestino || '';
      this.obtenerDatosPerfil();
    }
  }

  obtenerDatosPerfil(){
      if(this.idDestino){
        this.perfilService.getPerfilByIdUser(this.idDestino).subscribe({
          next: (perfilArray: Perfil[]) => {
            if (perfilArray.length > 0) {
              this.perfilSeleccionado = perfilArray[0]; 
              this.destinatarioName = this.perfilSeleccionado.userName || 'Usuario Destinatario';
            } else {
              console.error('El perfil no existe o no se encontró.');
            }
          },
          error: (e: Error) => {
            console.error('Error al obtener el perfil:', e);
          }
        })
      }
    }

///-----------INICIO EL FORMULARIO
formulario = this.fb.nonNullable.group({
  idUserEmisor: '',
  idUserDestinatario:'',
  fechaDeCreacion: '',
  mensaje: ['', [Validators.required, Validators.maxLength(500)]],
  visto: [false],
  eliminadoPor: this.fb.array([ this.fb.group({ idPerfil: [''], fechaDeEliminacion: [null] }) ]) });
//-----------GENERO UN NUEVO MENSAJE 
generarMensaje() {
  if (this.formulario.invalid) return;

  const formValues = this.formulario.getRawValue();

  // Verificar que `perfilSeleccionado` tiene un `idUser`
  if (!this.perfilSeleccionado?.idUser) {
    console.error('No se ha seleccionado un perfil válido.');
    return; // Detener la ejecución si el perfil no es válido
  }

  // Crear el mensaje con los valores del formulario y la fecha actual
  const chat: Chat = {
    ...formValues,
    idUserEmisor: this.idUsuario, 
    idUserDestinatario: this.perfilSeleccionado.idUser,
    fechaDeCreacion: new Date(), // Establece la fecha actual
    eliminadoPor: [] // Asegura que `eliminadoPor` sea un array vacío si no se usa
  };

  // Si el tipo es 'NUEVOMENSAJE', agregarlo a la base de datos
  if (this.tipo === 'NUEVOMENSAJE') {
    this.addMensajeBD(chat); // Crear un nuevo mensaje en la base de datos
  }

  // Cerrar el diálogo y devolver el mensaje al componente padre
  this.dialogRef.close(chat); 
}

//-----------AGREGO A LA BASE DE DATOS UN NUEVO MENSAJE

addMensajeBD(Chat: Chat) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Este mensaje será enviado al destinatario.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, enviar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      this.ChatService.sendMessage(Chat).subscribe({
        next: (Chat: Chat) => {
          Swal.fire({
            title: "¡Enviado!",
            text: "Tu mensaje ha sido enviado correctamente.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.dialogRef.close(Chat); // Cierra el modal al confirmar éxito
        },
        error: (e: Error) => {
          Swal.fire({
            title: "Error",
            text: "Ocurrió un problema al enviar el mensaje. Intenta nuevamente.",
            icon: "error",
          });
          console.log(e.message);
        },
      });
    }
  });
}


 cerrarModal(): void {
  this.dialogRef.close(); // Cierra el modal
}
}
