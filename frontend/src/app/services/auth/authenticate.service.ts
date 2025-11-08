import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
// O import é para o objeto environment central
import { environment } from '../../../environments/environment'; 
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  // CORREÇÃO AQUI: Usamos environment.apiUrl diretamente
  private authUrl = environment.apiUrl + '/auth';

  private authState = new BehaviorSubject({
    isAuthenticated: false,
    role: ''
  });

  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { 
    this.updateAuthState();
  }

  /**
   * Tenta fazer o login com documento e senha
   */
  login(documento: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { documento, password });
  }

  /**
   * Tenta registrar um novo usuário
   */
  register(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register`, registerData);
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  isCliente(): boolean {
    return this.getRole() === 'cliente';
  }
  
  isGerente(): boolean {
    return this.getRole() === 'GERENTE';
  }

  isEntregador(): boolean {
    return this.getRole() === 'entregador';
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.role || null;
    }
    return null;
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.email || null;
    }
    return null;
  }

  getName(): string | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.name || null;
    }
    return null;
  }

  getPhone(): string | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.phone || null;
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.updateAuthState();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.updateAuthState();
  }

  private updateAuthState(): void {
    this.authState.next({
      isAuthenticated: this.isAuthenticated(),
      role: this.getRole() || ''
    });
  }
}