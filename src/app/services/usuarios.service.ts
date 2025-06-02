import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  headers: HttpHeaders;

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {
    this.headers = new HttpHeaders().set("authorization", `Barear ${localStorage.getItem('token')}`);
  }

  getUsuarios(): Observable<any> {
    const href = `${this.supabaseService}usuarios/`;
    return this.http.get(href);
  }

  getUsuario(username: string, senha: string): Observable<any> {
    let body = {
      username: username,
      senha: senha
    }
    const href = `${this.supabaseService}usuarios/login/`;
    return this.http.post(href, body);
  }
  
  async saveUsuario(usuario: any): Promise<any> {
    const { data, error } = await this.supabaseService.supabase
    .from('users')
    .insert([
      usuario,
    ])
    .select();
  }
  
  updateUsuario(id: number, usuario: any): Observable<any> {
    const href = `${this.supabaseService}usuarios/${id}`;
    return this.http.patch(href, usuario, {
      headers: this.headers
    });
  }
  
  deleteUsuario(id: number): Observable<any> {
    const href = `${this.supabaseService}usuarios/${id}`;
    return this.http.delete(href, {
      headers: this.headers
    });
  }
}
