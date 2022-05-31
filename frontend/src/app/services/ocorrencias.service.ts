import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciasService {

  headers = new HttpHeaders().set("schema", "daniel_rodrigues");

  constructor(private http: HttpClient) { }

  getOcorrencias(params?: any): Observable<any> {
    let id_animal = params.id_animal != undefined ? params.id_animal : '';
    let id_medicamento = params.id_medicamento != undefined ? params.id_medicamento : '';

    const href = `${environment.api}ocorrencias?id_animal=${id_animal}&id_medicamento=${id_medicamento}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }
  
  saveOcorrencia(ocorrencia: any): Observable<any> {
    const href = `${environment.api}ocorrencias/`;
    return this.http.post(href, ocorrencia, {
      headers: this.headers
    });
  }
  
  updateOcorrencia(id: number, ocorrencia: any): Observable<any> {
    const href = `${environment.api}ocorrencias/${id}`;
    return this.http.patch(href, ocorrencia, {
      headers: this.headers
    });
  }
  
  deleteOcorrencia(id: number): Observable<any> {
    const href = `${environment.api}ocorrencias/${id}`;
    return this.http.delete(href, {
      headers: this.headers
    });
  }
}
