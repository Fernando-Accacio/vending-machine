import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router'; 
import { AuthenticateService } from './services/auth/authenticate.service';
import { filter } from 'rxjs'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  showHeader = true;
  isAuthenticated = false;
  isGerente = false;
  isCliente = false;
  isEntregador = false;
  
  // --- PROPRIEDADES DO USUÁRIO ---
  userName: string | null = null; 
  userEmail: string | null = null;
  // ------------------------------

  constructor(
    private authService: AuthenticateService, 
    private router: Router
  ) {
    // 4. "Escuta" o estado de autenticação
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.isGerente = state.role === 'GERENTE'; // <-- CORRIGIDO AQUI
      this.isCliente = state.role === 'cliente';
      this.isEntregador = state.role === 'entregador';

      // Atualiza os dados do usuário quando o estado de autenticação muda
      if (this.isAuthenticated) {
        this.userName = this.authService.getName();
        this.userEmail = this.authService.getEmail();
      } else {
        this.userName = null;
        this.userEmail = null;
      }
    });

    // 5. "Escuta" as mudanças de rota
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Esconde o header nas páginas de Login ou Registro
      if (event.url === '/login' || event.url === '/register') {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }

  goBack(): void {
    window.history.back();
  }

  canGoBack(): boolean {
    // Esconde o botão "voltar" na página inicial
    return this.router.url !== '/';
  }
}