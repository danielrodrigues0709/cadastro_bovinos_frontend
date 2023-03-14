import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InseminacoesService {

  headers: HttpHeaders;
  schema!: string;
  userStr = localStorage.getItem('user');
  @Output() inseminacoesUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    if(this.userStr) {
      this.schema = JSON.parse(this.userStr).username;
    }
    this.headers = new HttpHeaders().set("schema", this.schema).set("authorization", `Barear ${localStorage.getItem('token')}`);
  }

  getInseminacoes(params?: any): Observable<any> {
    let id_animal = params.id_animal != undefined ? params.id_animal : '';
    let id_reprodutor = params.id_reprodutor != undefined ? params.id_reprodutor : '';

    const href = `${environment.api}inseminacoes?id_animal=${id_animal}&id_reprodutor=${id_reprodutor}`;
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

  triggerInseminacoesUpdate(): void {
    this.inseminacoesUpdated.emit();
  }

}
