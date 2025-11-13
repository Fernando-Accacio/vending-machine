import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticateService } from '../../../services/auth/authenticate.service';
import { Router, RouterModule } from '@angular/router'; 

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
  // Variável para controlar o tipo do input (o "olhinho")
  passwordFieldType: string = 'password';

  // Sistema de Mensagens (Substituindo alert())
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };
  
  user = {
    documento: '',
    password: ''
  }

  constructor(private authService: AuthenticateService, private router: Router) {
  }

  // Função para alternar a visibilidade da Senha
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Novo método para exibir a mensagem na tela
  showMessage(text: string, type: 'success' | 'error' = 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = { text: '', type: null }, 5000); // Limpa após 5 segundos
  }

  login() {
    this.message = { text: '', type: null }; // Limpa mensagens anteriores
    
    this.authService.login(this.user.documento, this.user.password || '').subscribe(
      (data) => {
        
        this.authService.saveToken(data.token);
        const role = this.authService.getRole(); 
        
        // A lógica do carrinho (localStorage) foi mantida
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
      (error) => {
        this.showMessage('Documento e/ou senha inválidas!') 
        console.error('ERRO DE AUTENTICAÇÃO:', error);
      }
    );
  }
}