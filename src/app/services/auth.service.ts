import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  @Output() user: EventEmitter<any> = new EventEmitter<any>();
  @Output() loggedIn: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  logIn(token: string): void {
    let parsedToken = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(parsedToken.usuario));
    this.user.emit(parsedToken.usuario);
    this.loggedIn.emit(true);
  }

  logOut(): void {
    localStorage.clear();
    this.user.emit(null);
    this.loggedIn.emit(false);
  }

  updateUserData(usuario: any): void {
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(usuario));
    this.user.emit(usuario);
  }
  
}
