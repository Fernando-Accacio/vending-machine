import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

export interface ChangeCredentialsRequest {
  oldPassword: string;
  newPassword: string | null; 
  newUsername: string | null;
}

export interface UserDTO {
  id: number;
  name: string;
  documento: string;
  email: string;
  role: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  changeCredentials(request: ChangeCredentialsRequest): Observable<string> { 
    return this.http.post(`${this.apiUrl}/change-password`, request, { 
      ...this.getHeaders(),
      responseType: 'text' 
    });
  }

  deactivateMyAccount(password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/deactivate-my-account`, { password }, {
        ...this.getHeaders(),
        responseType: 'text'
    });
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/all`, this.getHeaders());
  }

  toggleUserStatus(id: number): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}/toggle-status`, {}, this.getHeaders());
  }
}