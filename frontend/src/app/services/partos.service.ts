import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartosService {

  headers = new HttpHeaders().set("schema", "daniel_rodrigues");
  @Output() partosUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  getPartos(params?: any): Observable<any> {
    let nro_controle_cria = params.nro_controle_cria != undefined ? params.nro_controle_cria : '';
    let nome_cria = params.nome_cria != undefined ? params.nome_cria : '';
    let id_cria = params.id_cria != undefined ? params.id_cria : '';
    let id_reprodutor = params.id_reprodutor != undefined ? params.id_reprodutor : '';
    let id_mae = params.id_mae != undefined ? params.id_mae : '';
    let sexo = params.sexo != undefined ? params.sexo : '';

    const href = `${environment.api}partos?nro_controle_cria=${nro_controle_cria}&nome_cria=${nome_cria}&id_cria=${id_cria}&id_reprodutor=${id_reprodutor}&id_mae=${id_mae}&sexo=${sexo}`;
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

  triggerPartosUpdate(): void {
    this.partosUpdated.emit();
  }

}
