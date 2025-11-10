import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// Ajuste o caminho conforme a localização real do seu UserService
import { UserService } from '../../services/user.service'; 
// 🚨 NOVO: Importe o serviço de autenticação para verificar o perfil
import { AuthenticateService } from '../../services/auth/authenticate.service'; 

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  passwords = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    // 🚨 NOVO: Injetar o serviço de autenticação
    private authService: AuthenticateService 
  ) {}

  /**
   * Determina e navega para a rota correta com base no perfil do usuário.
   * Gerente -> /itens
   * Cliente/Outros -> /
   */
  private navigateBasedOnRole(): void {
    // ⚠️ ATENÇÃO: Substitua 'getRole' e o valor 'gerente' pelo que seu authService usa.
    const userRole = this.authService.getRole(); 
    
    if (userRole === 'GERENTE') {
      // Redireciona para a tela de Itens (Gerenciamento)
      this.router.navigate(['/itens']); 
    } else {
      // Redireciona para a tela de Cardápio/Home (Cliente)
      this.router.navigate(['/']); 
    }
  }
  
  /**
   * Método para o botão "Voltar". Redireciona condicionalmente.
   */
  goBack(): void {
      this.navigateBasedOnRole();
  }


  changePassword(): void {
    if (this.passwords.newPassword !== this.passwords.confirmNewPassword) {
      alert('A "Nova Senha" e a "Confirmação" não conferem.');
      return;
    }

    const request = {
      oldPassword: this.passwords.oldPassword,
      newPassword: this.passwords.newPassword
    };

    // --- Chamada à API e Redirecionamento Condicional ---
    this.userService.changePassword(request).subscribe({
      next: (response) => {
        alert(response); 
        // Chama o método de navegação condicional após sucesso
        this.navigateBasedOnRole(); 
      },
      error: (err) => {
        alert(`Erro: ${err.error}`);
      }
    });
  }
}