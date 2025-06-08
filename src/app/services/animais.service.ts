import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimaisService {

  headers: HttpHeaders;
  schema!: string;
  userStr = localStorage.getItem('userId');
  @Output() animaisUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    if(this.userStr) {
      this.schema = JSON.parse(this.userStr).username;
    }
    this.headers = new HttpHeaders().set("schema", this.schema).set("authorization", `Barear ${localStorage.getItem('token')}`); 
  }

  getAnimais(params: any): Observable<any> {
    let nomeAnimal = params.nomeAnimal != undefined ? params.nomeAnimal : '';
    let sexo = params.sexo != undefined ? params.sexo : '';
    let producao = params.producao != undefined ? params.producao : '';
    let rebanho = params.rebanho != undefined ? params.rebanho : '';
    let nro_controle = params.nro_controle != undefined ? params.nro_controle : '';
    
    let routeParams = `nome_animal=${nomeAnimal}&sexo=${sexo}&producao=${producao}&rebanho=${rebanho}&nro_controle=${nro_controle}`;
    const href = `${environment.api}animais?${routeParams}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }

  getAnimalById(id_animal: number): Observable<any> {
    const href = `${environment.api}animais/${id_animal}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }

  getAnimalByDesc(nome_animal: string): Observable<any> {
    const href = `${environment.api}animais/searchByDesc/${nome_animal}`;
    return this.http.get(href, {
      headers: this.headers
    });
  }
  
  saveAnimal(animal: any): Observable<any> {
    const href = `${environment.api}animais/`;
    return this.http.post(href, animal, {
      headers: this.headers
    });
  }
  
  updateAnimal(id: number, animal: any): Observable<any> {
    const href = `${environment.api}animais/${id}`;
    return this.http.patch(href, animal, {
      headers: this.headers
    });
  }
  
  deleteAnimal(id: number): Observable<any> {
    const href = `${environment.api}animais/${id}`;
    return this.http.delete(href, {
      headers: this.headers
    });
  }

  triggerAnimaisUpdate(): void {
    this.animaisUpdated.emit();
  }

}
