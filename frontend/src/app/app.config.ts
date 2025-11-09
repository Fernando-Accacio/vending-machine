import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { DishStoreComponent } from './components/dish-store/dish-store.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ReportsComponent } from './pages/gerente/reports/reports.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { MyWithdrawalsComponent } from './pages/cliente/my-withdrawals/my-withdrawals.component'; // NOVO IMPORT
import { authGuard } from './services/auth/guards/auth-guard';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { clienteGuardGuard } from './services/auth/guards/cliente-guard.guard';
import { gerenteGuardGuard } from './services/auth/guards/gerente-guard.guard';

// --- DEFINIÇÃO DAS CONSTANTES DE DOMÍNIO PARA CLAREZA ---
// Nota: O allowedDomains geralmente espera apenas o domínio/host, sem protocolo.
const API_DOMAIN = 'vending-machine-z87w.onrender.com'; 
const VERCEL_DOMAIN = 'vending-social.vercel.app'; 


// --- O MAPA DE ROTAS FINAL E LIMPO ---
const routes: Routes = [
  { path: '', component: DishStoreComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Rotas do Admin (Gerente)
  { path: 'itens', component: DishListComponent, canActivate: [gerenteGuardGuard] },
  { path: 'add-item', component: DishFormComponent, canActivate: [gerenteGuardGuard] },
  { path: 'edit-item/:id', component: DishFormComponent, canActivate: [gerenteGuardGuard] },
  { path: 'relatorios', component: ReportsComponent, canActivate: [gerenteGuardGuard] },

  // Rota de Mudar Senha (Qualquer um logado)
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },  
  // --- ROTA DE CLIENTE NOVO ---
  { path: 'minhas-retiradas', component: MyWithdrawalsComponent, canActivate: [clienteGuardGuard] },

  // Redireciona qualquer rota "lixo" para a página inicial
  { path: '**', redirectTo: '' }
];

export function tokenGetter() {
  return localStorage.getItem("token");
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),

    importProvidersFrom(
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          // APENAS DOMÍNIOS DE PRODUÇÃO
          allowedDomains: [
            API_DOMAIN, 
            VERCEL_DOMAIN
          ], 
          // APENAS ROTAS DE PRODUÇÃO
          disallowedRoutes: [
            `https://${API_DOMAIN}/auth/login`,
            `https://${API_DOMAIN}/auth/register`,
          ],
        },
      })
    ),
  ]
};