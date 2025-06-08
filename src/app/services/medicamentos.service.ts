import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  headers: HttpHeaders;
  schema!: string;
  userStr = localStorage.getItem('userId');
  @Output() medicamentosUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    if(this.userStr) {
      this.schema = JSON.parse(this.userStr).username;
    }
    this.headers = new HttpHeaders().set("schema", this.schema).set("authorization", `Barear ${localStorage.getItem('token')}`); 
  }

  getMedicamentos(params: any): Observable<any> {
    let medicamento = params.medicamento != undefined ? params.medicamento : '';
    const href = `${environment.api}medicamentos?medicamento=${medicamento}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }

  getMedicamentosById(id: number): Observable<any> {
    const href = `${environment.api}medicamentos/${id}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }

  getMedicamentosByDesc(medicamento: string): Observable<any> {
    const href = `${environment.api}medicamentos/searchByDesc/${medicamento}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }
  
  saveMedicamento(medicamento: any): Observable<any> {
    const href = `${environment.api}medicamentos/`;
    return this.http.post(href, medicamento, {
      headers: this.headers
    });
  }
  
  updateMedicamento(id: number, medicamento: any): Observable<any> {
    const href = `${environment.api}medicamentos/${id}`;
    return this.http.patch(href, medicamento, {
      headers: this.headers
    });
  }
  
  deleteMedicamento(id: number): Observable<any> {
    const href = `${environment.api}medicamentos/${id}`;
    return this.http.delete(href, {
      headers: this.headers
    });
  }

  triggerMedicamentosUpdate(): void {
    this.medicamentosUpdated.emit();
  }

}
