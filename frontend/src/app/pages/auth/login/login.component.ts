import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticateService } from '../../../services/auth/authenticate.service';
import { Router, RouterModule } from '@angular/router'; 
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
export class LoginComponent implements OnInit {
  
  public isLoadingLocal: boolean = true;
  
  passwordFieldType: string = 'password';
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };

  user = {
    documento: '',
    password: ''
  }

  constructor(
    private authService: AuthenticateService, 
    private router: Router,
    private loadingService: LoadingService 
  ) {}

  ngOnInit(): void {
    // Simula um carregamento muito rápido para consistência visual
    setTimeout(() => {
      this.isLoadingLocal = false;
    }, 50); // 50ms é quase instantâneo
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  showMessage(text: string, type: 'success' | 'error' = 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = { text: '', type: null }, 5000);
  }

  login() {
    this.message = { text: '', type: null }; 
    
    // ATIVA APENAS O LOADING GLOBAL (Correto para a ação de login)
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
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingService.hide();
      }
    });
  }
}