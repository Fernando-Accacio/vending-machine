import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticateService } from '../../services/auth/authenticate.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  // Variáveis para controlar o tipo do input (o "olhinho")
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  // Sistema de Mensagens (Substituindo alert())
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };
  
  // Nosso "molde" para o formulário
  registerData = {
    name: '',
    email: '',
    documento: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthenticateService,
    private router: Router
  ) {}

  // Função para alternar a visibilidade da Senha
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Função para alternar a visibilidade da Confirmação de Senha
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  // Novo método para exibir a mensagem na tela
  showMessage(text: string, type: 'success' | 'error' = 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = { text: '', type: null }, 5000); // Limpa após 5 segundos
  }

  register(): void {
    this.message = { text: '', type: null }; // Limpa mensagens anteriores

    // 1. Checa se as senhas são iguais
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showMessage('As senhas não conferem!');
      return;
    }
    
    // 2. Tira o 'confirmPassword' (o back-end não precisa dele)
    const { confirmPassword, ...requestData } = this.registerData;

    // 3. Chama o "mensageiro" (AuthService)
    this.authService.register(requestData).subscribe({
      next: (response) => {
        this.showMessage('Usuário registrado com sucesso! Por favor, faça o login.', 'success');
        setTimeout(() => {
          this.router.navigate(['/login']); // Redireciona para o login
        }, 2000);
      },
      error: (err) => {
        console.error('Erro no registro', err);
        // Pega a mensagem de erro que o back-end enviou (ex: "Usuário já cadastrado")
        this.showMessage(`Erro ao registrar: ${err.error.message || err.statusText}`);
      }
    });
  }
}