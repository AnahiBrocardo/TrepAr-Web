import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../../Interfaces/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url: string= 'http://localhost:3000/api';

   constructor(private http: HttpClient) { }


   // Obtener todos los chats de un usuario
  getChats(idUsuario: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.url}/${idUsuario}`);
  }

  // Enviar un nuevo mensaje
  sendMessage(chat: Chat): Observable<Chat> {
    return this.http.post<Chat>(`${this.url}`, chat);
  }

  actualizarChat(idChat: string, chat: Chat): Observable<Chat> {
    return this.http.put<Chat>(`${this.url}/${idChat}`, chat);
  }

}
