import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartosService {

  headers = new HttpHeaders().set("schema", "daniel_rodrigues");

  constructor(private http: HttpClient) { }

  getPartos(): Observable<any> {
    const href = `${environment.api}partos/`;
    return this.http.get(href, {
      headers: this.headers
    });
  }
  
  saveParto(parto: any): Observable<any> {
    const href = `${environment.api}partos/`;
    return this.http.post(href, parto, {
      headers: this.headers
    });
  }
  
  updateParto(id: number, parto: any): Observable<any> {
    const href = `${environment.api}partos/${id}`;
    return this.http.patch(href, parto, {
      headers: this.headers
    });
  }
  
  deleteParto(id: number): Observable<any> {
    const href = `${environment.api}partos/${id}`;
    return this.http.delete(href, {
      headers: this.headers
    });
  }
}
