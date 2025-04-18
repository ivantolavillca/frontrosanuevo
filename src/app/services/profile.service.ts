import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { UserUpdate } from 'app/interfaces/UserUpdate';
import { appsettings } from 'app/settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.BackendUrl;

  constructor() { }

  updateUser(userData: UserUpdate): Observable<UserUpdate> {
    return this.http.put<UserUpdate>(`${this.baseUrl}profile/update/`, userData);
  }
}
