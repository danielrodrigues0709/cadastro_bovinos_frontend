import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  @Output() loggedIn: EventEmitter<any> = new EventEmitter<any>();
  public isLoggedIn!: boolean;

  constructor() { }

  logIn(): void {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
    this.loggedIn.emit(this.isLoggedIn);
  }

  logOut(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    this.loggedIn.emit(this.isLoggedIn);
  }
}
