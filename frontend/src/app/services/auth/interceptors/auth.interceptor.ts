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
      
      // Só faz logout forçado se for 401/403 E NÃO FOR UMA TENTATIVA DE LOGIN
      // Se a URL for '.../auth/login', deixamos o erro passar para o componente Login mostrar a mensagem.
      const isLoginRequest = req.url.includes('/login');

      if ((error.status === 401 || error.status === 403) && !isLoginRequest) {
        console.warn('Sessão expirada ou acesso negado em rota protegida.');
        
        authService.logout(); 
        router.navigate(['/login']);
        
        return throwError(() => new Error('Sessão Inválida'));
      }
      
      // Se for erro no Login (ou erro 500, 404, etc), propaga o erro original
      // Assim o seu login.component.ts vai receber o JSON correto com a mensagem!
      return throwError(() => error); 
    })
  );
};