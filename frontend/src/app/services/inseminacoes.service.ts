import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InseminacoesService {

  headers = new HttpHeaders().set("schema", "daniel_rodrigues");

  constructor(private http: HttpClient) { }

  getInseminacoes(): Observable<any> {
    const href = `${environment.api}inseminacoes/`;
    return this.http.get(href, {
      headers: this.headers
    });
  }
  
  saveInseminacao(inseminacao: any): Observable<any> {
    const href = `${environment.api}inseminacoes/`;
    return this.http.post(href, inseminacao, {
      headers: this.headers
    });
  }
  
  updateInseminacao(id: number, inseminacao: any): Observable<any> {
    const href = `${environment.api}inseminacoes/${id}`;
    return this.http.patch(href, inseminacao, {
      headers: this.headers
    });
  }
  
  deleteInseminacao(id: number): Observable<any> {
    const href = `${environment.api}inseminacoes/${id}`;
    return this.http.delete(href, {
      headers: this.headers
    });
  }
}
