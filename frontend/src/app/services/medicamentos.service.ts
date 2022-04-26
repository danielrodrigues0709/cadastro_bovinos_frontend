import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  headers = new HttpHeaders().set("schema", "daniel_rodrigues");

  constructor(private http: HttpClient) { }

  listaMedicamentos(): Observable<any> {
    const href = `${environment.api}medicamentos/`;
    return this.http.get(href, {
      headers: this.headers
    });
  }
  
  salvaMedicamento(): Observable<any> {
    let medicamento = { medicamento: 'Medicamento de teste'};

    const href = `${environment.api}medicamentos/`;
    return this.http.post(href, medicamento, {
      headers: this.headers
    });
  }

  // TODO Implementar CRUD
}
