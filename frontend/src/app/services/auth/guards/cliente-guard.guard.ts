import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticateService } from '../authenticate.service';

export const clienteGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticateService);
  const router = inject(Router);

  // 1. CHECAGEM GERAL DE AUTENTICAÇÃO (Token Válido)
  if (!authService.isAuthenticated()) {
    authService.logout(); 
    router.navigateByUrl('/login'); 
    return false;
  }

  // 2. CHECAGEM DE AUTORIZAÇÃO (Role)
  const role = authService.getRole();
  
  // Padroniza a Role para MAIÚSCULAS antes de comparar para evitar erro de Case Sensitivity
  const standardizedRole = role ? role.toUpperCase() : null; 

  // As roles autorizadas são 'CLIENTE' (Maiúsculo) OU 'GERENTE' (Maiúsculo)
  if (standardizedRole === 'CLIENTE' || standardizedRole === 'GERENTE') {
    return true; // Acesso permitido
  }

  // 3. SE ESTÁ AUTENTICADO MAS SEM ROLE CORRETA
  console.warn(`Acesso negado para a role: ${role}. Redirecionando para o cardápio.`);
  
  router.navigateByUrl('/'); 
  return false;
};