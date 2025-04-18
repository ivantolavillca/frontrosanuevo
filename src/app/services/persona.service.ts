import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Persona } from 'app/interfaces/Personas';
import { appsettings } from 'app/settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.BackendUrl;

  constructor() { }

  GetPersonas(limit: number, offset: number, search?: string): Observable<{ count: number, results: Persona[] }> {
    let url = `${this.baseUrl}personas/?limit=${limit}&offset=${offset}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.http.get<{ count: number, results: Persona[] }>(url);
  }
  GetPersona(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.baseUrl}personas/${id}/`);
  }

  SearchPersonas(termino: string): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}personas/?search=${termino}`);
  }

  CreatePersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.baseUrl}personas/`, persona);
  }

  UpdatePersona(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.baseUrl}personas/${id}/`, persona);
  }

  DeletePersona(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}personas/${id}/`);
  }
  exportData(format: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}report/persona/`, { responseType: 'blob' });
  }
}
