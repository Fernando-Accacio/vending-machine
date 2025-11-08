import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// *** NOVA IMPORTAÇÃO DO ARQUIVO DE AMBIENTE PADRÃO ***
import { environment } from '../../environments/environment'; 

// Interface (molde) para o DTO do back-end
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  // CORREÇÃO AQUI: Usa environment.apiUrl diretamente
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  /**
   * Chama a API para trocar a senha
   */
  changePassword(request: ChangePasswordRequest): Observable<string> { 
    // Dizemos ao HttpClient para esperar uma resposta de TEXTO, não JSON
    return this.http.post(`${this.apiUrl}/change-password`, request, { 
      responseType: 'text' 
    });
  }
}