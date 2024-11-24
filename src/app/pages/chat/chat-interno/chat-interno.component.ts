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
  mensaje: string = ''; // Variable para almacenar el mensaje
  idUser: string = '';
  chatService = inject(ChatService);
  perfilService = inject(PerfilService);
  currentChat?: any;
  chatsConUsuario: any[] = []; // Asegúrate de que esta variable esté inicializada como un arreglo vacío
  
  ngOnInit(): void {
    this.idUser = localStorage.getItem('userId') || '';
    this.obtenerTodosLosChats();
  }

  obtenerTodosLosChats() {
    this.chatService.getAllChats().subscribe({
      next: (chats: Chat[]) => {
        // Filtrar los chats para incluir solo los chats donde el idUser esté involucrado
        const chatsFiltrados = chats.filter(chat => 
          chat.idUserEmisor === this.idUser || chat.idUserDestinatario === this.idUser
        );
  
        // Agrupar los chats por idUserEmisor y idUserDestinatario
        const chatsAgrupados = this.agruparChatsPorUsuario(chatsFiltrados);
        console.log(chatsAgrupados);
  
        // Inicializar el array de chatsConUsuario
        this.chatsConUsuario = [];
  
        // Crear una lista de observables para obtener los perfiles de los emisores
        const perfilRequests = chatsAgrupados.map((chatGroup) =>
          this.perfilService.getPerfilByIdUser(chatGroup.idUserEmisor).pipe(
            map((perfilEmisor: Perfil[]) => {
              // Ordenar los mensajes por fechaDeCreacion
              const mensajesOrdenados = chatGroup.chats.sort((a: Chat, b: Chat) => {
                return new Date(a.fechaDeCreacion).getTime() - new Date(b.fechaDeCreacion).getTime();
              });
  
              // Verificar si el último mensaje no ha sido visto
              const ultimoMensajeNoVisto = mensajesOrdenados.length > 0 && !mensajesOrdenados[mensajesOrdenados.length - 1].visto;
  
              // Añadir los mensajes y los datos del perfil del emisor al array final
              return {
                idUser: chatGroup.idUserEmisor,  // Usamos el id del emisor como id del grupo
                username: perfilEmisor[0]?.userName || 'Nombre no disponible', // Asignar nombre del emisor
                imagen: perfilEmisor[0]?.imagePerfil || 'default-image.jpg', // Asignar imagen del emisor
                mensajes: mensajesOrdenados,  // Incluir los mensajes ordenados
                ultimoMensajeNoVisto: ultimoMensajeNoVisto,  // Propiedad para saber si el último mensaje no fue visto
              };
            })
          )
        );
  
        // Usar forkJoin para esperar que todos los perfiles sean obtenidos
        forkJoin(perfilRequests).subscribe({
          next: (resultados) => {
            // Aplanar el array de resultados y asignarlo a chatsConUsuario
            this.chatsConUsuario = resultados;
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
      // Crear una clave única para cada par de usuarios, independientemente de quien sea el emisor o destinatario
      const key = [chat.idUserEmisor, chat.idUserDestinatario].sort().join('-');
  
      // Si no existe una clave para este par de usuarios, la inicializamos
      if (!chatGroups[key]) {
        chatGroups[key] = {
          idUserEmisor: chat.idUserEmisor,
          idUserDestinatario: chat.idUserDestinatario,
          chats: [],
        };
      }
  
      // Añadir el chat al grupo correspondiente
      chatGroups[key].chats.push(chat);
    });
  
    // Convertir el objeto chatGroups a un array y devolverlo
    return Object.values(chatGroups);
  }
  
  

seleccionarChat(chatSeleccionado: any) {
  this.currentChat= chatSeleccionado;
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
}
