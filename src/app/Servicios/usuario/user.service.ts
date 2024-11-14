import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../Interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = 'http://localhost:3000/users';
  
  http= inject(HttpClient);
  
  constructor() { }


  public inicUser(){
    let user: User = {
      id: '',
      email: '',
      password: '',
      createdAt: new Date,
      deletedAt: null,
      nombre: '',
      apellido:''
    }
  
    return user;
  }
  

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.url}`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }



  getUserById(id: string):Observable<User>{
    return this.http.get<User>(`${this.url}/${id}`);
  } 

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.url);
  } 
  
  
 // Método para verificar si un email ya está en uso
 checkEmailExists(email: string): Observable<User[]> {
  return this.http.get<User[]>(`${this.url}?email=${email}`);
}

}
