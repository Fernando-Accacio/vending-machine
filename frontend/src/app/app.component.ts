import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthenticateService } from './services/auth/authenticate.service';
import { UserService } from './services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  isMenuOpen = false;
  isAuthenticated = false;
  isGerente = false;
  isEntregador = false;
  isCliente = false;
  userName: string | null = '';
  
  isLoadingGlobal = false;
  showHeader = true;

  // --- Variáveis para Desativação de Conta ---
  showDeactivateModal = false;
  deactivatePassword = '';
  deactivateError = '';
  isDeactivating = false;

  constructor(
    private authService: AuthenticateService,
    private userService: UserService, // Injetar UserService
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.userName = this.authService.getName();
      
      this.isGerente = this.authService.isGerente();
      this.isEntregador = this.authService.isEntregador();
      this.isCliente = this.authService.isCliente();
      
      // Lógica para esconder header no login (opcional)
      this.showHeader = this.router.url !== '/login';
    });

    this.router.events.subscribe(() => {
      this.showHeader = this.router.url !== '/login';
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.isLoadingGlobal = true;
    setTimeout(() => {
      this.authService.logout();
      this.isLoadingGlobal = false;
      this.isMenuOpen = false;
      this.router.navigate(['/login']);
    }, 800);
  }

  // --- Lógica do Modal de Desativação ---
  openDeactivateModal() {
    this.showDeactivateModal = true;
    this.deactivatePassword = '';
    this.deactivateError = '';
    this.isMenuOpen = false; // Fecha o menu mobile se estiver aberto
  }

  closeDeactivateModal() {
    this.showDeactivateModal = false;
    this.deactivatePassword = '';
  }

  confirmDeactivate() {
    if (!this.deactivatePassword) {
      this.deactivateError = 'Por favor, digite sua senha.';
      return;
    }

    this.isDeactivating = true;
    this.deactivateError = '';

    this.userService.deactivateMyAccount(this.deactivatePassword).subscribe({
      next: (res) => {
        alert('Sua conta foi desativada com sucesso.');
        this.isDeactivating = false;
        this.closeDeactivateModal();
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        // Se o backend retornar erro de senha (400 ou 403)
        this.deactivateError = 'Senha incorreta ou erro ao desativar.';
        this.isDeactivating = false;
      }
    });
  }
}