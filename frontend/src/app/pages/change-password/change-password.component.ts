import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

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
    private router: Router
  ) {}

  changePassword(): void {
    if (this.passwords.newPassword !== this.passwords.confirmNewPassword) {
      alert('A "Nova Senha" e a "Confirmação" não conferem.');
      return;
    }

    const request = {
      oldPassword: this.passwords.oldPassword,
      newPassword: this.passwords.newPassword
    };

    // --- CORREÇÃO AQUI ---
    this.userService.changePassword(request).subscribe({
      next: (response) => {
        // 'response' agora é o texto "Senha alterada com sucesso!"
        alert(response); 
        this.router.navigate(['/']); // Volta para a página principal
      },
      error: (err) => {
        // 'err.error' agora é o texto "A senha antiga está incorreta."
        alert(`Erro: ${err.error}`);
      }
    });
  }
}