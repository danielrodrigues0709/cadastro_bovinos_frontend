import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  @Output() user: EventEmitter<any> = new EventEmitter<any>();
  @Output() loggedIn: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  logIn(data: any): void {
    localStorage.setItem('token', data?.session?.access_token);
    localStorage.setItem('userId', data?.session?.user.id);
    this.user.emit(data?.session?.access_token);
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
