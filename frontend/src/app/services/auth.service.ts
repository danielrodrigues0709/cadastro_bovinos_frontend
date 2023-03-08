import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  @Output() loggedIn: EventEmitter<any> = new EventEmitter<any>();
  public isLoggedIn!: boolean;

  constructor() { }

  logIn(user: any): void {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn.emit(this.isLoggedIn);
  }

  logOut(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    this.loggedIn.emit(this.isLoggedIn);
  }
}
