import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from 'app/settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseLogin } from 'app/interfaces/ResponseLogin';
import { Login } from 'app/interfaces/login';
import { ResposeValidToken } from 'app/interfaces/ResposeValidToken';
import { Token } from 'app/interfaces/token';

@Injectable({
     providedIn: 'root'
})
export class AccesoService {

     private http = inject(HttpClient);
     private baseUrl: string = appsettings.BackendUrl;

     constructor() { }

    //  registrarse(objeto: Usuario): Observable<ResponseAcceso> {
    //       return this.http.post<ResponseAcceso>(`${this.baseUrl}Acceso/Registrarse`, objeto)
    //  }

     login(objeto: Login): Observable<ResponseLogin> {
          return this.http.post<ResponseLogin>(`${this.baseUrl}auth/login`, objeto)
     }

     validarToken(objeto: Token): Observable<ResposeValidToken> {
          return this.http.post<ResposeValidToken>(`${this.baseUrl}auth/token/validate`,objeto)
     }
}
