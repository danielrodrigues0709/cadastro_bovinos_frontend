import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacinacoesService {

  headers: HttpHeaders;
  schema!: string;
  userStr = localStorage.getItem('user');
  @Output() vacinacoesUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    if(this.userStr) {
      this.schema = JSON.parse(this.userStr).username;
    }
    this.headers = new HttpHeaders().set("schema", this.schema).set("authorization", `Barear ${localStorage.getItem('token')}`); 
  }

  getVacinacoes(params?: any): Observable<any> {
    let id_vacina = params.id_vacina != undefined ? params.id_vacina : '';
    let id_animal = params.id_animal != undefined ? params.id_animal : '';
    let tipo = params.tipo != undefined ? params.tipo : '';

    const href = `${environment.api}vacinacoes?id_animal=${id_animal}&id_vacina=${id_vacina}&tipo=${tipo}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }
  
  saveVacinacao(vacinacao: any): Observable<any> {
    const href = `${environment.api}vacinacoes/`;
    return this.http.post(href, vacinacao, {
      headers: this.headers
    });
  }
  
  updateVacinacao(id: number, vacinacao: any): Observable<any> {
    const href = `${environment.api}vacinacoes/${id}`;
    return this.http.patch(href, vacinacao, {
      headers: this.headers
    });
  }
  
  deleteVacinacao(id: number): Observable<any> {
    const href = `${environment.api}vacinacoes/${id}`;
    return this.http.delete(href, {
      headers: this.headers
    });
  }

  triggerVacinacoesUpdate(): void {
    this.vacinacoesUpdated.emit();
  }

}
