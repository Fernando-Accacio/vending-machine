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
  user = {
    documento: '',
    password: ''
  }

  constructor(private authService: AuthenticateService, private router: Router) {
  }

  login() {
    
    this.authService.login(this.user.documento, this.user.password || '').subscribe(
      (data) => {
        
        this.authService.saveToken(data.token);
        const role = this.authService.getRole(); 
        
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
        alert('Documento e/ou senha inválidas!') 
        console.error('ERRO DE AUTENTICAÇÃO:', error);
      }
    );
  }
}