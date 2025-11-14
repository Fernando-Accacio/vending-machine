import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

// Interface (molde) para o DTO do back-end (ATUALIZADA)
export interface ChangeCredentialsRequest {
  oldPassword: string;
  newPassword: string | null; // Agora pode ser null
  newUsername: string | null; // <<< NOVO CAMPO
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  /**
   * Chama a API para trocar senha e/ou nome de usuário
   */
  changeCredentials(request: ChangeCredentialsRequest): Observable<string> { 
    // Dizemos ao HttpClient para esperar uma resposta de TEXTO, não JSON
    return this.http.post(`${this.apiUrl}/change-password`, request, { 
      responseType: 'text' 
    });
  }
}