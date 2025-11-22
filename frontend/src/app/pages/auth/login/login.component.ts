import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticateService } from '../../../services/auth/authenticate.service';
import { DishService } from '../../../services/dish.service';
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
    private dishService: DishService,
    private router: Router,
    private loadingService: LoadingService 
  ) {}

  ngOnInit(): void {
    // Mantém a tela travada (isLoadingLocal = true)
    // e faz uma requisição leve ao backend apenas para "acordá-lo".
    
    this.dishService.getDishes().subscribe({
      next: () => {
        // Se o backend respondeu (sucesso), ele acordou. Libera a tela.
        this.isLoadingLocal = false; 
      },
      error: (err) => {
        // Se deu erro, o backend também acordou (respondeu com erro).
        // Liberamos a tela para o usuário ver as mensagens de erro se tentar logar.
        console.warn("Backend acordou com erro (ou sem itens), liberando tela.", err);
        this.isLoadingLocal = false; 
      }
    });
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
            this.showMessage(serverMessage || 'Sua conta foi suspensa. Entre em contato com a gerência.');
        } else if (error.status === 401) {
            this.showMessage('Documento e/ou senha inválidas!');
        } else {
            this.showMessage('Erro de conexão ou servidor indisponível.');
        }
        
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingService.hide();
      }
    });
  }
}