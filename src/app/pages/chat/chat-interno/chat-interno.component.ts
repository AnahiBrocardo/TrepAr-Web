import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Chat } from '../../../Interfaces/chat';
import { ChatService } from '../../../Servicios/chatInterno/chat.service';
import { PerfilService } from '../../../Servicios/perfil/perfil.service';
import { Perfil } from '../../../Interfaces/perfil.interface';
import { FormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-chat-interno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-interno.component.html',
  styleUrl: './chat-interno.component.css'
})
export class ChatInternoComponent implements OnInit{
  
  chats: Chat[] = [];
  filtro: string = '';
  mensaje: string = ''; // Variable para almacenar el mensaje
  
  originalChatsConUsuario: any[] = [];// Variable para guardar los chats originales
  idUser: string = '';
  chatService = inject(ChatService);
  perfilService = inject(PerfilService);
  currentChat?: any;
  chatsConUsuario: any[] = []; // Asegúrate de que esta variable esté inicializada como un arreglo vacío
  
  ngOnInit(): void {
    this.idUser = localStorage.getItem('userId') || '';
    this.obtenerTodosLosChats();
    console.log()
  }

  obtenerTodosLosChats() {
    this.chatService.getAllChats().subscribe({
      next: (chats: Chat[]) => {
        // Filtrar los chats relevantes para el usuario actual
        const chatsFiltrados = chats.filter(chat =>
          chat.idUserEmisor === this.idUser || chat.idUserDestinatario === this.idUser
        );
  
        // Agrupar los chats por id del otro usuario
        const chatsAgrupados = this.agruparChatsPorUsuario(chatsFiltrados);
        console.log('Chats agrupados:', chatsAgrupados);
  
        // Crear una lista de observables para obtener los perfiles de los otros usuarios
        const perfilRequests = chatsAgrupados.map((chatGroup) => {
          // Determinar el otro usuario (diferente al actual)
          const otroUsuarioId = chatGroup.idUserEmisor === this.idUser
            ? chatGroup.idUserDestinatario
            : chatGroup.idUserEmisor;
          console.log(otroUsuarioId);
          // Solicitar el perfil del otro usuario
          return this.perfilService.getPerfilByIdUser(otroUsuarioId).pipe(
            map((perfil: Perfil[]) => {
              // Ordenar los mensajes por fecha de creación
              const mensajesOrdenados = chatGroup.chats.sort((a: Chat, b: Chat) =>
                new Date(a.fechaDeCreacion).getTime() - new Date(b.fechaDeCreacion).getTime()
              );
  
              // Verificar si el último mensaje no ha sido visto
              const ultimoMensajeNoVisto = mensajesOrdenados.length > 0 && !mensajesOrdenados[mensajesOrdenados.length - 1].visto;
  
              return {
                idUser: otroUsuarioId,
                username: perfil[0]?.userName ,
                imagen: perfil[0]?.imagePerfil,
                mensajes: mensajesOrdenados,
                ultimoMensajeNoVisto,
              };
              console.log(this.chatsConUsuario);
            })
          );
        });
  
        // Esperar todos los perfiles usando forkJoin
        forkJoin(perfilRequests).subscribe({
          next: (resultados) => {
            this.chatsConUsuario = resultados;
            this.originalChatsConUsuario = [...resultados];
          },
          error: (err) => {
            console.error('Error al obtener los perfiles:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener los chats:', err);
      }
    });
  }
  
  agruparChatsPorUsuario(chats: Chat[]) {
    const chatGroups: { [key: string]: any } = {};
  
    chats.forEach((chat) => {
      // Determinar el id del otro usuario
      const otroUsuarioId = chat.idUserEmisor === this.idUser
        ? chat.idUserDestinatario
        : chat.idUserEmisor;
  
      // Si no existe una clave para este usuario, inicializarla
      if (!chatGroups[otroUsuarioId]) {
        chatGroups[otroUsuarioId] = {
          idUserEmisor: chat.idUserEmisor,
          idUserDestinatario: chat.idUserDestinatario,
          chats: [],
        };
      }
  
      // Añadir el chat al grupo correspondiente
      chatGroups[otroUsuarioId].chats.push(chat);
    });
  
    // Convertir el objeto chatGroups a un array y devolverlo
    return Object.values(chatGroups);
  }
  
  filtrarChats(): void {
    const terminoBusqueda = this.filtro.trim().toLowerCase();
  
    if (!terminoBusqueda) {
      // Si no hay texto en el filtro, mostrar todos los chats
      this.chatsConUsuario = [...this.originalChatsConUsuario];
      return;
    }
  
    // Filtrar los chats por coincidencia en el nombre de usuario
    this.chatsConUsuario = this.originalChatsConUsuario.filter(chat =>
      chat.username.toLowerCase().includes(terminoBusqueda)
    );
  }

seleccionarChat(chatSeleccionado: any) {
  this.currentChat= chatSeleccionado;
   this.marcarMensajeComoVisto(chatSeleccionado);
}

enviarMensaje() {
  if (this.mensaje.trim() !== '') {

    this.perfilService.checkUserNameExists(this.currentChat.username).subscribe({
      next: (perfilData) => {
        if (perfilData.length > 0) {
          const perfil = perfilData[0]; 
        } else {
          console.log('No se encontró el perfil para este username');
        }
      },
      error: (err) => {
        console.error('Error al obtener el perfil:', err);
      }
    });

    const nuevoMensaje: Chat = {
      idUserEmisor: this.idUser,
      idUserDestinatario: this.currentChat.idUser,
      mensaje: this.mensaje,
      visto: false,
      fechaDeCreacion: new Date(),
      eliminadoPor: [],
    };
      this.chatService.enviarChat(nuevoMensaje).subscribe({
        next: (mensajeEnviado) => {
          console.log('Mensaje enviado:', mensajeEnviado);

          // Actualizar el chat actual con el nuevo mensaje
          this.currentChat.mensajes.push(mensajeEnviado);
          this.mensaje = '';  // Limpiar input después de enviar el mensaje
        },
        error: (err) => {
          console.error('Error al enviar el mensaje:', err);
        }
      });
    } else {
      console.error('No se encontró el chat para este usuario.');
    }
  }





  autoResize(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';  // Restablecer la altura
    textarea.style.height = `${textarea.scrollHeight}px`;  // Ajustar a la altura necesaria
    if (textarea.scrollHeight > 40) { // Establecer límite de altura en dos filas
      textarea.style.height = '80px';  // Ajusta al tamaño máximo
      textarea.style.overflowY = 'auto';  // Habilita la barra de desplazamiento si es necesario
    } else {
      textarea.style.overflowY = 'hidden';  // Oculta la barra de desplazamiento si no es necesaria
    }
  }


  marcarMensajeComoVisto(chatSeleccionado: any) {
    // Verificar si hay un último mensaje no visto
    const ultimoMensaje = chatSeleccionado.mensajes[chatSeleccionado.mensajes.length - 1];
  
    if (ultimoMensaje && !ultimoMensaje.visto) {
      // Actualizar en el servidor
      ultimoMensaje.visto=true;
      this.chatService.actualizarChat(ultimoMensaje.id, ultimoMensaje).subscribe({
        next: () => {
          console.log('Mensaje marcado como visto en el servidor.');
  
          // Actualizar en el array local
          ultimoMensaje.visto = true;
          chatSeleccionado.ultimoMensajeNoVisto = false;
        },
        error: (err: Error) => {
          console.error('Error al marcar el mensaje como visto:', err);
        }
      });
    }
  }
  
}
