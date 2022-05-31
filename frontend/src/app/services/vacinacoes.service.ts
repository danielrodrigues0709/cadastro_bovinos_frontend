import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacinacoesService {

  headers = new HttpHeaders().set("schema", "daniel_rodrigues");

  constructor(private http: HttpClient) { }

  getVacinacoes(params?: any): Observable<any> {
    let id_vacina = params.id_vacina != undefined ? params.id_vacina : '';
    let id_animal = params.id_animal != undefined ? params.id_animal : '';
    let tipo = params.tipo != undefined ? params.tipo : '';

    const href = `${environment.api}vacinacoes?id_animal=${id_vacina}&id_vacina=${id_animal}&tipo=${tipo}`;
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
}
