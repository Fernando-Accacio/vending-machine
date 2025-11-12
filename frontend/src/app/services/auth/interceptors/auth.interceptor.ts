import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticateService } from '../authenticate.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticateService);
  const router = inject(Router);

  const token = authService.getToken();
  
  // 1. ANEXA O TOKEN A TODAS AS REQUISIÇÕES
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. ADICIONA O TRATAMENTO DE ERROS
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se o erro for 401 (Não Autorizado) ou 403 (Proibido)
      if (error.status === 401 || error.status === 403) {
        console.warn('Sessão expirada ou acesso negado (401/403). Redirecionando para login.');
        
        // Força o logout e redireciona
        authService.logout(); 
        router.navigate(['/login']);
        
        // Não propaga o erro de autenticação, apenas o de login
        // Podemos parar a execução aqui ou propagar o erro
        return throwError(() => new Error('Sessão Inválida'));
      }
      
      // Para todos os outros erros (ex: 500, 404), apenas propaga
      return throwError(() => error); 
    })
  );
};