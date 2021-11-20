import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  constructor(private http: HttpClient) { }

  teste(): Observable<any> {
    const href = `${environment.api}api/`;
    return this.http.get(href);
  }

  listMedicamentos(): Observable<any> {
    const href = `${environment.api}medicamentos/`;
    return this.http.get(href);
  }

  // TODO Implementar CRUD
}
