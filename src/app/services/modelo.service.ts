import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Clasificacion } from 'app/interfaces/Clasificacion';
import { RequestModelo } from 'app/interfaces/Modelo';
import { Persona } from 'app/interfaces/Personas';
import { ResponseModel } from 'app/interfaces/ResponseModel';
import { appsettings } from 'app/settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.BackendUrl;

  constructor() { }

  GetModeloMachineLearning(request: RequestModelo): Observable<ResponseModel
  > {
    return this.http.post<ResponseModel>(`${this.baseUrl}predecir-obesidad/`, request);
}
}
