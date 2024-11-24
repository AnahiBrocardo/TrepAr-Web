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
        this.perfilService.getPerfilByIdPerfil(this.idDestino).subscribe({
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

 // Ajusta `eliminadoPor` para cumplir con la interfaz
 const eliminadoPor = formValues.eliminadoPor.map(item => ({
  idPerfil: item.idPerfil || '', // Asegura que siempre sea string
  fechaDeEliminacion: item.fechaDeEliminacion || null // Asegura que sea Date o null
  }));

  // Convierte el valor de `fechaDeCreacion` a un objeto de tipo Date
  const chat: Chat = {
    ...formValues,
    idUserEmisor: this.idUsuario, 
    idUserDestinatario: this.idDestino,
    fechaDeCreacion: new Date(), // Establece una fecha válida
    eliminadoPor
  };

// Convertir fechaDeCreacion a Date 
  if (this.tipo === 'NUEVOMENSAJE') {
    this.addMensajeBD(chat); // Crear un nuevo mensaje
  } 

  this.dialogRef.close(chat); // Devuelve el mensaje al componente padre
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
