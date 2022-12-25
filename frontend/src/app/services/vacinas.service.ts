import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacinasService {

  headers = new HttpHeaders().set("schema", "daniel_rodrigues");

  constructor(private http: HttpClient) { }

  getVacinas(params?: any): Observable<any> {
    let vacina_vermifugo = params.vacina_vermifugo != undefined ? params.vacina_vermifugo : '';
    let tipo = params.tipo != undefined ? params.tipo : '';

    const href = `${environment.api}vacinas?vacina_vermifugo=${vacina_vermifugo}&tipo=${tipo}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }

  getVacinaById(id_vacina: number): Observable<any> {
    const href = `${environment.api}vacinas/${id_vacina}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }
  
  saveVacina(vacina: any): Observable<any> {
    const href = `${environment.api}vacinas/`;
    return this.http.post(href, vacina, {
      headers: this.headers
    });
  }
  
  updateVacina(id: number, vacina: any): Observable<any> {
    const href = `${environment.api}vacinas/${id}`;
    return this.http.patch(href, vacina, {
      headers: this.headers
    });
  }
  
  deleteVacina(id: number): Observable<any> {
    const href = `${environment.api}vacinas/${id}`;
    return this.http.delete(href, {
      headers: this.headers
    });
  }
}
