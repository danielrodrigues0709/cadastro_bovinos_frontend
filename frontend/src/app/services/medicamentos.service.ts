import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  constructor(private http: HttpClient) { }

  listaMedicamentos(): Observable<any> {
    const href = `${environment.api}medicamentos/`;
    return this.http.get(href);
  }
  
  salvaMedicamento(): Observable<any> {
    let medicamento = { medicamento: 'Medicamento de teste'};

    const href = `${environment.api}medicamentos/`;
    return this.http.post(href, medicamento);
  }

  // TODO Implementar CRUD
}
