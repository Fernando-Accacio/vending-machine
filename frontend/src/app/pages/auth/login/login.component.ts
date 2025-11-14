import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticateService } from '../../../services/auth/authenticate.service';
import { Router, RouterModule } from '@angular/router'; 
// NOVO: Importe o LoadingService
import { LoadingService } from '../../../services/loading/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    RouterModule 
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  passwordFieldType: string = 'password';
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };
  
  user = {
    documento: '',
    password: ''
  }

  // NOVO: Injete o LoadingService
  constructor(
    private authService: AuthenticateService, 
    private router: Router,
    private loadingService: LoadingService 
  ) {}

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  showMessage(text: string, type: 'success' | 'error' = 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = { text: '', type: null }, 5000);
  }

  login() {
    this.message = { text: '', type: null }; 
    
    // 1. ATIVA O LOADING
    this.loadingService.show(); 
    
    this.authService.login(this.user.documento, this.user.password || '').subscribe({
      next: (data) => {
        this.authService.saveToken(data.token);
        const role = this.authService.getRole(); 
        
        const cart = localStorage.getItem('cart');
        if (cart) {
          this.router.navigate(['/']); 
          return;
        }
        
        switch(role) {
          case 'GERENTE':
            this.router.navigate(['/itens']); 
            break;
          case 'cliente':
            this.router.navigate(['/']);
            break
          case 'entregador':
            this.router.navigate(['/entregas']); 
            break
          default:
            this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.showMessage('Documento e/ou senha inválidas!') 
        console.error('ERRO DE AUTENTICAÇÃO:', error);
      },
      complete: () => {
        // 2. DESATIVA O LOADING (executa após next ou error)
        this.loadingService.hide(); 
      }
    });
  }
}