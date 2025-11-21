import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common'; // <--- Location
import { AuthenticateService } from '../../../services/auth/authenticate.service';
import { Router, RouterModule } from '@angular/router'; 
import { LoadingService } from '../../../services/loading/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  public isLoadingLocal: boolean = true;
  passwordFieldType: string = 'password';
  message: { text: string, type: 'success' | 'error' | null } = { text: '', type: null };

  user = { documento: '', password: '' }

  constructor(
    private authService: AuthenticateService, 
    private router: Router,
    private loadingService: LoadingService,
    private location: Location // <--- Injeção
  ) {}

  ngOnInit(): void {
    setTimeout(() => { this.isLoadingLocal = false; }, 50); 
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  showMessage(text: string, type: 'success' | 'error' = 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = { text: '', type: null }, 5000);
  }

  goBack(): void {
    this.location.back();
  }

  login() {
    this.message = { text: '', type: null }; 
    this.loadingService.show(); 
    
    this.authService.login(this.user.documento, this.user.password || '').subscribe({
      next: (data) => {
        this.authService.saveToken(data.token);
        const role = this.authService.getRole(); 
        
        if (localStorage.getItem('cart')) {
          this.router.navigate(['/']); 
          return;
        }
        
        switch(role) {
          case 'GERENTE': this.router.navigate(['/itens']); break;
          case 'cliente': this.router.navigate(['/']); break;
          case 'entregador': this.router.navigate(['/entregas']); break;
          default: this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.log('ERRO LOGIN:', error);
        const serverMessage = error.error?.message;

        if (error.status === 403) {
            this.showMessage(serverMessage || 'Sua conta foi suspensa.');
        } else if (error.status === 401) {
            this.showMessage('Documento e/ou senha inválidas!');
        } else if (error.status === 0) {
            this.showMessage('Servidor Offline. Verifique se o Java está rodando.');
        } else {
            this.showMessage(`Erro desconhecido (Cód: ${error.status}). Tente novamente.`);
        }
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingService.hide();
      }
    });
  }
}