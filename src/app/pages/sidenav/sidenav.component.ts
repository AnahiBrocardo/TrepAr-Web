import { MensajeModalComponent } from './../principal/mensaje-modal/mensaje-modal.component';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, OnInit, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../Servicios/chatInterno/chat.service';
import { Chat } from '../../Interfaces/chat';
import { forkJoin, map } from 'rxjs';
import { PerfilService } from '../../Servicios/perfil/perfil.service';
import { Perfil } from '../../Interfaces/perfil.interface';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{
  @Input()  //recibo el id del dashboard
  idUser: string ='';
  router= inject(Router);
  chatService = inject(ChatService);
  chatsConUsuario: any[] = [];
  perfilService = inject(PerfilService);
  mensajesNoVistos:boolean=false;
  
  ngOnInit(): void {
    this.idUser = localStorage.getItem('userId') || '';
    this.determinarSiHayMensajesNoVistos();
    // Suscribirse al Observable para recibir notificaciones de nuevos mensajes
    this.chatService.shouldCheckMessages$.subscribe((shouldCheck) => {
      if(shouldCheck){
        this.determinarSiHayMensajesNoVistos();
      }
    });
  }


  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  items = [
    {
      routeLink: 'inicio',
      icon: 'fal fa-house',
      label: 'Inicio',
    },
    {
      routeLink: 'comunidad',
      icon: 'fal fa-user-group',
      label: 'Comunidad',
    },
        {
      routeLink: 'simulador',
      icon: 'fal fa-file',
      label: 'Simulador',
    },
    {
      routeLink: 'settings',
      icon: 'fal fa-cog',
      label: 'Configuracion',
    },
    {
      routeLink: 'perfil',
      icon: 'fal fa-user',
      label: 'Perfil',
    },
    {
      routeLink: 'chat',
      icon: 'fal fa-comments ',
      extraIcon: 'fa-solid fa-circle-exclamation', // Segundo icono
      label: 'Chats',
    },
    {
      routeLink: 'preguntas-frecuentes',
      icon: 'fal fa-circle-question',
      label: 'Ayuda',
    }
  ];


  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  redirigir(){
    localStorage.removeItem('userId'); //se elimina el token del idusuario 
    localStorage.removeItem('token'); //se elimina el token del usuario 
    this.router.navigate(['/']).then(() => {//navega a la página de inicio
      window.location.reload();//Refresca la página completamente 
    });
  }
  
  determinarSiHayMensajesNoVistos() {
    this.chatService.getAllChats().subscribe({
      next: (chats: Chat[]) => {
        // Filtrar los chats relevantes para el usuario actual
        const chatsFiltrados = chats.filter(chat =>
          chat.idUserEmisor === this.idUser || chat.idUserDestinatario === this.idUser
        );
  
        // Agrupar los chats por id del otro usuario
        const chatsAgrupados = this.agruparChatsPorUsuario(chatsFiltrados);
  
        // Variable para almacenar el detalle de los grupos con mensajes no vistos
        const gruposConMensajesNoVistos = [];
  
        chatsAgrupados.forEach(chatGroup => {
          // Ordenar los mensajes por fecha de creación
          const mensajesOrdenados = chatGroup.chats.sort((a: Chat, b: Chat) =>
            new Date(a.fechaDeCreacion).getTime() - new Date(b.fechaDeCreacion).getTime()
          );
  
          // Obtener el último mensaje de este grupo
          const ultimoMensaje = mensajesOrdenados[mensajesOrdenados.length - 1];
  
          // Verificar si el último mensaje no ha sido visto
          if (
            ultimoMensaje &&
            ultimoMensaje.idUserDestinatario === this.idUser &&
            !ultimoMensaje.visto
          ) {
            gruposConMensajesNoVistos.push({
              idGrupo: chatGroup.idUserEmisor === this.idUser
                ? chatGroup.idUserDestinatario
                : chatGroup.idUserEmisor,
              ultimoMensaje: ultimoMensaje.mensaje, // o contenido relevante del mensaje
              fecha: ultimoMensaje.fechaDeCreacion
            });
          }
        });
  
        // Total de grupos con mensajes no vistos
        const totalNoVistos = gruposConMensajesNoVistos.length;
        if(totalNoVistos>0){
          this.mensajesNoVistos=true;
        }else{
          this.mensajesNoVistos=false;
        }
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
}


