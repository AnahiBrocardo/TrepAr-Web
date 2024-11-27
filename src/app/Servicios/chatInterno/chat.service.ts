import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat } from '../../Interfaces/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url: string= 'http://localhost:3004/chats';
  private _shouldCheckMessages = new BehaviorSubject<boolean>(false);
  shouldCheckMessages$ = this._shouldCheckMessages.asObservable();

   constructor(private http: HttpClient) { }

   // Obtener todos los chats de un usuario
  getAllChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.url}`);
  }

   // Obtener todos los chats de un usuario
  getChats(idUsuario: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.url}?idUserDestinatario=${idUsuario}`);
  }

  enviarChat(chat:Chat): Observable<Chat>{
    return this.http.post<Chat>(`${this.url}`, chat);
  }

  // Enviar un nuevo mensaje
  sendMessage(chat: Chat): Observable<Chat> {
    return this.http.post<Chat>(`${this.url}`, chat);
  }

  actualizarChat(idChat: string, chat: Chat): Observable<Chat> {
    return this.http.put<Chat>(`${this.url}/${idChat}`, chat);
  }

   // Método para notificar que deben comprobarse los mensajes
   notifyToCheckMessages() {
    this._shouldCheckMessages.next(true);
  }

  // Método para resetear la notificación
  resetCheckMessages() {
    this._shouldCheckMessages.next(false);
  }

}
