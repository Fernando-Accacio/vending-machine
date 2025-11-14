import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router'; 
import { AuthenticateService } from './services/auth/authenticate.service';
import { filter } from 'rxjs'; 
// CORRIGIDO: Certifique-se de que o caminho está correto
import { LoadingService } from './services/loading/loading.service';

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
  
  // CORRIGIDO: Adição da declaração da variável
  isLoadingGlobal: boolean = false; 
  
  // ... o resto das propriedades
  isMenuOpen = false; 
  userName: string | null = null; 
  userEmail: string | null = null;
  // ...

  constructor(
    private authService: AuthenticateService, 
    private router: Router,
    // CORRIGIDO: Injeção do serviço
    private loadingService: LoadingService 
  ) {
    // CORRIGIDO: Tipagem explícita (isLoading: boolean)
    this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
      this.isLoadingGlobal = isLoading;
    });
    
    // ... o restante do código
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.isGerente = state.role === 'GERENTE'; 
      this.isCliente = state.role === 'cliente';
      this.isEntregador = state.role === 'entregador';

      if (this.isAuthenticated) {
        this.userName = this.authService.getName();
        this.userEmail = this.authService.getEmail();
      } else {
        this.userName = null;
        this.userEmail = null;
      }
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/login' || event.url === '/register') {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
      this.isMenuOpen = false;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }

  goBack(): void {
    window.history.back();
  }

  canGoBack(): boolean {
    return this.router.url !== '/';
  }
}