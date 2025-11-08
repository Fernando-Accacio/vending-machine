import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getUrl } from './config/env';

// Interface (molde) para o DTO do back-end
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = getUrl() + '/users';

  constructor(private http: HttpClient) { }

  /**
   * Chama a API para trocar a senha
   */
  changePassword(request: ChangePasswordRequest): Observable<string> { // <-- Mudado para Observable<string>
    // --- CORREÇÃO AQUI ---
    // Dizemos ao HttpClient para esperar uma resposta de TEXTO, não JSON
    return this.http.post(`${this.apiUrl}/change-password`, request, { 
      responseType: 'text' 
    });
  }
}