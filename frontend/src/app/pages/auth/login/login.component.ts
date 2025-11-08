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
    console.log('LoginComponent carregado.'); // 1. O componente foi carregado?
  }

  login() {
    console.log('--- LOGIN CLICADO ---'); // 2. O clique no botão foi detectado?
    
    this.authService.login(this.user.documento, this.user.password || '').subscribe(
      (data) => {
        console.log('SUCESSO NA REQUISIÇÃO! Dados recebidos:', data); // 3. O backend respondeu com sucesso?
        
        this.authService.saveToken(data.token);
        const role = this.authService.getRole(); 
        
        console.log('SUCESSO NO LOGIN! Role extraída do token:', role); // 4. A 'role' foi lida?
        
        const cart = localStorage.getItem('cart');
        if (cart) {
          console.log('Carrinho encontrado, redirecionando para /');
          this.router.navigate(['/']); 
          return;
        }
        
        switch(role) {
          case 'GERENTE':
            console.log('Redirecionando para /itens');
            this.router.navigate(['/itens']); 
            break;
          case 'cliente':
            console.log('Redirecionando para / (cliente)');
            this.router.navigate(['/']);
            break
          case 'entregador':
            console.log('Redirecionando para /entregas');
            this.router.navigate(['/entregas']); 
            break
          default:
            console.log('Role não bateu ("' + role + '"), redirecionando para / (default)');
            this.router.navigate(['/']);
        }
      },
      (error) => {
        // 5. Se o login falhar (senha errada), deve cair aqui.
        alert('Documento e/ou senha inválidas!') 
        console.error('ERRO DE AUTENTICAÇÃO:', error);
      }
    );
    
    console.log('Função login() terminada.'); // 6. A função foi executada até o fim?
  }
}