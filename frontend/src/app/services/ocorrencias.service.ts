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

  getOcorrencias(): Observable<any> {
    const href = `${environment.api}ocorrencias/`;
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
