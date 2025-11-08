import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Precisamos do FormsModule
import { Router, RouterModule } from '@angular/router'; // Precisamos do RouterModule
import { AuthenticateService } from '../../services/auth/authenticate.service'; // O "mensageiro"

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Adicionamos os imports
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
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

  register(): void {
    // 1. Checa se as senhas são iguais
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('As senhas não conferem!');
      return;
    }
    
    // 2. Tira o 'confirmPassword' (o back-end não precisa dele)
    const { confirmPassword, ...requestData } = this.registerData;

    // 3. Chama o "mensageiro" (AuthService)
    this.authService.register(requestData).subscribe({
      next: (response) => {
        alert('Usuário registrado com sucesso! Por favor, faça o login.');
        this.router.navigate(['/login']); // Redireciona para o login
      },
      error: (err) => {
        console.error('Erro no registro', err);
        // Pega a mensagem de erro que o back-end enviou (ex: "Usuário já cadastrado")
        alert(`Erro ao registrar: ${err.error}`);
      }
    });
  }
}