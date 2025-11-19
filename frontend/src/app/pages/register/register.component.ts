import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticateService } from '../../services/auth/authenticate.service';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  public isLoadingLocal: boolean = true;

  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };

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
    private router: Router,
    private loadingService: LoadingService 
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoadingLocal = false;
    }, 50);
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  showMessage(text: string, type: 'success' | 'error' = 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = { text: '', type: null }, 5000);
  }

  register(): void {
    this.message = { text: '', type: null };

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showMessage('As senhas não conferem!');
      return;
    }
    
    const { confirmPassword, ...requestData } = this.registerData;

    // ATIVA APENAS O LOADING GLOBAL (Correto para a ação de registro)
    this.loadingService.show(); 

    this.authService.register(requestData).subscribe({
      next: (response) => {
        this.showMessage('Usuário registrado com sucesso! Por favor, faça o login.', 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erro no registro', err);
        this.showMessage(`Erro ao registrar: ${err.error.message || err.statusText}`);
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingService.hide();
      }
    });
  }
}