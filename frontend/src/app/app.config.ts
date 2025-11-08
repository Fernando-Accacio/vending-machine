import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// --- IMPORTAÇÕES PARA O JWT (O "PORTEIRO") ---
import { JwtHelperService, JwtInterceptor, JwtModule } from '@auth0/angular-jwt';

// --- NOSSOS COMPONENTES (O QUE ESTÁ EM USO) ---
import { DishListComponent } from './components/dish-list/dish-list.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { DishStoreComponent } from './components/dish-store/dish-store.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ReportsComponent } from './pages/gerente/reports/reports.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

// --- OUTROS PROVIDERS ---
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { clienteGuardGuard } from './services/auth/guards/cliente-guard.guard';
import { gerenteGuardGuard } from './services/auth/guards/gerente-guard.guard';

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
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [clienteGuardGuard] },

  // Redireciona qualquer rota "lixo" para a página inicial
  { path: '**', redirectTo: '' }
];

// --- FUNÇÃO AUXILIAR PARA O JWT ---
// Diz ao 'porteiro' onde pegar o token no seu navegador
export function tokenGetter() {
  return localStorage.getItem("token");
}

// --- A CONFIGURAÇÃO PRINCIPAL (CORRIGIDA) ---
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),

    // --- CONFIGURAÇÃO DO JWT (A CORREÇÃO DO "Erro: null") ---
    importProvidersFrom(
      HttpClientModule,
      
      // Configura o "Porteiro" (JwtInterceptor)
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter, // Usa a função acima para pegar o token
          
          // --- A CORREÇÃO ESTÁ AQUI ---
          // Lista de domínios que PODEM receber o token:
          allowedDomains: [
            "localhost:8081", 
            "vending-machine-z87w.onrender.com" // Adicionado o domínio de produção
          ], 
          
          // Lista de rotas que NÃO PODEM receber o token:
          disallowedRoutes: [
            "https://vending-machine-z87w.onrender.com/auth/login",
            "https://vending-machine-z87w.onrender.com/auth/register",
            "http://localhost:8081/auth/login",
            "http://localhost:8081/auth/register"
          ],
        },
      })
    ),
  ]
};