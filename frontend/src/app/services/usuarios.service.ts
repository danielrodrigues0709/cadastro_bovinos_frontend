import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  listaUsuarios(): Observable<any> {
    const href = `${environment.api}usuarios/`;
    return this.http.get(href);
  }
  
  salvaUsuario(): Observable<any> {
    let usuario = {
      usuario: "Daniel Rodrigues",
      email: "danielrodrigues0709@gmail.com",
      senha: "123456"
    };

    const href = `${environment.api}usuarios/`;
    return this.http.post(href, usuario);
  }

  // TODO Implementar CRUD
}
