import { Component, OnInit } from '@angular/core';
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
export class ChangePasswordComponent implements OnInit {

  // Variáveis para controlar o tipo do input (o "olhinho")
  showOldPasswordType: string = 'password';
  showNewPasswordType: string = 'password';
  showConfirmNewPasswordType: string = 'password';

  // Sistema de Mensagens
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };

  // Controla o estado de carregamento
  isLoading: boolean = true; // INICIA COMO TRUE

  // DTO de credenciais AGORA INCLUI o nome de usuário (newUsername)
  credentials = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    newUsername: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthenticateService 
  ) {}

  ngOnInit(): void {
    // Simula um carregamento inicial rápido (pode ser verificação de sessão, etc)
    setTimeout(() => {
      this.isLoading = false;
    }, 500); // Carrega por 500ms ao entrar na tela
  }

  // Funções para alternar a visibilidade (mantidas)
  toggleOldPasswordVisibility(): void {
    this.showOldPasswordType = this.showOldPasswordType === 'password' ? 'text' : 'password';
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPasswordType = this.showNewPasswordType === 'password' ? 'text' : 'password';
  }

  toggleConfirmNewPasswordVisibility(): void {
    this.showConfirmNewPasswordType = this.showConfirmNewPasswordType === 'password' ? 'text' : 'password';
  }

  // Método para exibir a mensagem na tela
  showMessage(text: string, type: 'success' | 'error' = 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = { text: '', type: null }, 5000); 
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

  changeCredentials(): void {
    this.message = { text: '', type: null }; 

    // 1. Validação: A senha antiga é obrigatória
    if (!this.credentials.oldPassword) {
      this.showMessage('A Senha Atual é obrigatória para qualquer alteração.');
      return;
    }

    // 2. Validação: Se informou nova senha, a confirmação é obrigatória e deve ser igual
    if (this.credentials.newPassword) {
      if (this.credentials.newPassword !== this.credentials.confirmNewPassword) {
        this.showMessage('A "Nova Senha" e a "Confirmação" não conferem.');
        return;
      }
    }
    
    // 3. Validação: Checa se há alguma alteração para enviar
    const newPasswordTrimmed = this.credentials.newPassword.trim();
    const newUsernameTrimmed = this.credentials.newUsername.trim();
    
    if (!newPasswordTrimmed && !newUsernameTrimmed) {
        this.showMessage('Informe o Novo Nome de Usuário ou a Nova Senha para salvar.', 'error');
        return;
    }

    const request = {
      oldPassword: this.credentials.oldPassword,
      newPassword: newPasswordTrimmed || null, 
      newUsername: newUsernameTrimmed || null 
    };

    // ATIVA O CARREGAMENTO ao processar
    this.isLoading = true;

    // --- Chamada à API e Tratamento de Erro CORRIGIDO ---
    this.userService.changeCredentials(request).subscribe({ 
      next: (response) => {
        // DESATIVA O CARREGAMENTO
        this.isLoading = false;
        
        // Sucesso
        this.showMessage('Credenciais alteradas com sucesso! Você será desconectado em breve para entrar com as novas credenciais.', 'success');
        
        setTimeout(() => {
            this.authService.logout(); 
            this.router.navigate(['/auth/login']); 
        }, 2000);
      },
      // Extrai a mensagem de erro do corpo da resposta 400 (que é texto puro)
      error: (err) => {
            // DESATIVA O CARREGAMENTO
            this.isLoading = false;
            
            // Usa err.error (que contém a string de texto 'A senha atual está incorreta.')
            const errorMessage = err.error || err.statusText; 
            this.showMessage(`Erro: ${errorMessage || 'Falha na alteração de credenciais.'}`);
      }
    });
  }
}