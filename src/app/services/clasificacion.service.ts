import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Clasificacion } from 'app/interfaces/Clasificacion';
import { Persona } from 'app/interfaces/Personas';
import { appsettings } from 'app/settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasifiacionService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.BackendUrl;

  constructor() { }

  GetClasificacion(): Observable<Clasificacion[]> {
    return this.http.get<Clasificacion[]>(`${this.baseUrl}clasificacion/`);
  }

}
