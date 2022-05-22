import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<any> {
    const href = `${environment.api}usuarios/`;
    return this.http.get(href);
  }
  
  saveUsuario(usuario: any): Observable<any> {
    const href = `${environment.api}usuarios/`;
    return this.http.post(href, usuario);
  }
  
  updateUsuario(id: number, usuario: any): Observable<any> {
    const href = `${environment.api}usuarios/${id}`;
    return this.http.patch(href, usuario);
  }
  
  deleteUsuario(id: number): Observable<any> {
    const href = `${environment.api}usuarios/${id}`;
    return this.http.delete(href);
  }
}
