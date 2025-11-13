import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service'; 
import { AuthenticateService } from '../../services/auth/authenticate.service'; 

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  // Variáveis para controlar o tipo do input (o "olhinho")
  showOldPasswordType: string = 'password';
  showNewPasswordType: string = 'password';
  showConfirmNewPasswordType: string = 'password';

  // Sistema de Mensagens (Substituindo alert())
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };

  passwords = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthenticateService 
  ) {}

  // Funções para alternar a visibilidade
  toggleOldPasswordVisibility(): void {
    this.showOldPasswordType = this.showOldPasswordType === 'password' ? 'text' : 'password';
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPasswordType = this.showNewPasswordType === 'password' ? 'text' : 'password';
  }

  toggleConfirmNewPasswordVisibility(): void {
    this.showConfirmNewPasswordType = this.showConfirmNewPasswordType === 'password' ? 'text' : 'password';
  }

  // Novo método para exibir a mensagem na tela
  showMessage(text: string, type: 'success' | 'error' = 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = { text: '', type: null }, 5000); // Limpa após 5 segundos
  }

  private navigateBasedOnRole(): void {
    const userRole = this.authService.getRole(); 
    
    if (userRole === 'GERENTE') {
      this.router.navigate(['/itens']); 
    } else {
      this.router.navigate(['/']); 
    }
  }
  
  goBack(): void {
      this.navigateBasedOnRole();
  }

  changePassword(): void {
    this.message = { text: '', type: null }; // Limpa mensagens anteriores

    if (this.passwords.newPassword !== this.passwords.confirmNewPassword) {
      this.showMessage('A "Nova Senha" e a "Confirmação" não conferem.');
      return;
    }

    const request = {
      oldPassword: this.passwords.oldPassword,
      newPassword: this.passwords.newPassword
    };

    // --- Chamada à API e Redirecionamento Condicional ---
    this.userService.changePassword(request).subscribe({
      next: (response) => {
        this.showMessage('Senha alterada com sucesso!', 'success');
        setTimeout(() => {
          this.navigateBasedOnRole(); 
        }, 2000);
      },
      error: (err) => {
        this.showMessage(`Erro: ${err.error.message || err.statusText}`);
      }
    });
  }
}