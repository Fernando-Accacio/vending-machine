import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticateService } from '../authenticate.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticateService);
  const router = inject(Router);

  // Apenas checa se existe um token válido (autenticado)
  if (authService.isAuthenticated()) {
    return true; 
  }

  // Se não estiver logado, redireciona para o login
  router.navigate(['/login']);
  return false; 
};