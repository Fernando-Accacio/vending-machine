import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticateService } from '../authenticate.service';

export const gerenteGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticateService);
  const router = inject(Router);

  const role = authService.getRole();
  
  if (role === 'GERENTE') { // Checa por "GERENTE" (maiúsculo)
    return true;
  }
  
  // Se não for GERENTE, manda de volta para o login
  router.navigate(['/login']);
  return false;
};