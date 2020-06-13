import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Registro } from '../models/registro';
import { Observable, observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

var process : {
  env: {
    URL_API_SERVICES: string
  }
}

@Injectable({
  providedIn: 'root'
})


export class RegistroService {

  constructor(private http: HttpClient) { }

  url = process.env.URL_API_SERVICES;
  apiUrl = this.url + 'registro';

 getRegistro(id: number): Observable<any>{   
    return this.http.get(`${this.apiUrl}/${id}`); 
  }

 getRegistroByFecha(registro: Registro): Observable<any>{   
    return this.http.get(`${this.apiUrl}-fecha/${registro.fecha}`); 
  }
  
 getRegistros():Observable<any>{
    return this.http.get(this.apiUrl);
  }

  createRegistro(registro: Registro): Observable<any>{
    return this.http.post<any>(this.apiUrl, registro, httpOptions);
  }

  updateRegistro(registro: Registro): Observable<any>{
    return this.http.put(`${this.apiUrl}/${registro.id}`, registro, httpOptions);
  }

  deleteRegistro(registro: Registro): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${registro.id}`);
  }

}
