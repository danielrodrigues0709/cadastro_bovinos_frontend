import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimaisService {

  headers = new HttpHeaders().set("schema", "daniel_rodrigues");

  constructor(private http: HttpClient) { }

  getAnimais(): Observable<any> {
    const href = `${environment.api}animais/`;
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
}
