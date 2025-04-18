import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from 'app/settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.BackendUrl;

  constructor() { }

  GetDatosGenero(): Observable<{ [key: string]: number }> {
    
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}cantidad-genero`);
  }
  GetClasificacionPersona(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}pesonas-clasificacion`);
  }
}
