import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router'; 
import { AuthenticateService } from './services/auth/authenticate.service';
import { filter, Subscription } from 'rxjs'; 
import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend';
  showHeader = true;
  isAuthenticated = false;
  isGerente = false;
  isCliente = false;
  isEntregador = false;
  
  isLoadingGlobal: boolean = false; 
  
  isMenuOpen = false; 
  userName: string | null = null; 
  userEmail: string | null = null;

  // --- SUBSCRIPTIONS PARA LIMPAR DEPOIS ---
  private loadingSubscription?: Subscription;
  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private authService: AuthenticateService, 
    private router: Router,
    private loadingService: LoadingService 
  ) {}

  ngOnInit(): void {
    // --- INSCRIÇÃO NO LOADING SERVICE ---
    this.loadingSubscription = this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
      this.isLoadingGlobal = isLoading;
    });
    
    // --- INSCRIÇÃO NO AUTH STATE ---
    this.authSubscription = this.authService.authState$.subscribe(state => {
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

    // --- INSCRIÇÃO NO ROUTER ---
    this.routerSubscription = this.router.events.pipe(
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

  ngOnDestroy(): void {
    // --- LIMPA TODAS AS SUBSCRIPTIONS ---
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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