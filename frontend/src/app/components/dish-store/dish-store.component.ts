import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishService, Dish } from '../../services/dish.service'; 
import { Router } from '@angular/router';

// --- NOVAS IMPORTAÇÕES ---
import { AuthenticateService } from '../../services/auth/authenticate.service';
import { WithdrawalService, CartItemDto, WithdrawalRequest } from '../../services/withdrawal.service'; // O novo serviço

interface CartItem extends Dish {
  quantity: number;
}

const TEMPO_FIXO_MAQUINA = 10; 

@Component({
  selector: 'app-dish-store',
  templateUrl: './dish-store.component.html',
  styleUrls: ['./dish-store.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DishStoreComponent implements OnInit {
  dishes: Dish[] = [];
  cart: CartItem[] = [];
  totalAmount: number = 0;
  totalLeadTime: number = 0; 

  // --- CONSTRUTOR ATUALIZADO ---
  constructor(
    private dishService: DishService, 
    private router: Router,
    private authService: AuthenticateService, // Injetamos o serviço de Auth
    private withdrawalService: WithdrawalService // Injetamos o novo serviço
  ) {}

  ngOnInit(): void {
    this.loadDishes();
    this.updateTotal(); 
  }

  loadDishes(): void {
    this.dishService.getDishes().subscribe((data: Dish[]) => {
      this.dishes = data;
    });
  }

  addToCart(dish: Dish): void {
    const existingItem = this.cart.find(item => item.id === dish.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...dish, quantity: 1 });
    }
    this.updateTotal();
  }

  removeFromCart(dish: CartItem): void {
    const index = this.cart.findIndex(item => item.id === dish.id);
    if (index > -1) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity -= 1;
      } else {
        this.cart.splice(index, 1);
      }
    }
    this.updateTotal();
  }

  updateTotal(): void {
    this.totalAmount = this.cart.reduce((total, item) => {
      return total + (item.custo * item.quantity);
    }, 0);

    const leadTimeVariavel = this.cart.reduce((total, item) => {
        const tempoItem = item.tempoReposicao || 0; 
        return total + (tempoItem * item.quantity);
    }, 0);

    if (this.cart.length > 0) {
        this.totalLeadTime = TEMPO_FIXO_MAQUINA + leadTimeVariavel;
    } else {
        this.totalLeadTime = 0; 
    }
  }

  //
  // --- FUNÇÃO CHECKOUT TOTALMENTE REESCRITA ---
  //
checkout(): void {
    
    // 1. Checa se o usuário está logado (usando o método mais robusto)
    if (!this.authService.isAuthenticated()) {
      alert('Você precisa estar logado para finalizar uma retirada!');
      
      // Manda para a rota de login que definimos no app.config.ts
      this.router.navigate(['/login']); 
      return;
    }
    
    // Se estiver autenticado, pegamos o email. Se for null (o que não deveria ser), tratamos.
    const email = this.authService.getEmail(); 
    if (!email) {
        alert('Erro de autenticação: Email não encontrado no token. Tente fazer login novamente.');
        this.router.navigate(['/login']); 
        return;
    }


    // 2. Transforma o carrinho (front-end) no formato que o back-end espera (DTO)
    const cartDto: CartItemDto[] = this.cart.map(item => ({
      dishId: item.id,
      quantity: item.quantity
    }));

    // 3. Monta o objeto final da requisição
    const request: WithdrawalRequest = {
      email: email,
      cart: cartDto
    };

    // 4. Chama o novo serviço para salvar no banco
    this.withdrawalService.createWithdrawal(request).subscribe({
      next: (response) => {
        // Sucesso!
        alert('Retirada registrada com sucesso!');
        // Limpa o carrinho e navega
        this.cart = [];
        this.updateTotal();
        localStorage.removeItem('cart'); // Limpa o carrinho antigo do localStorage
        
        this.router.navigate(['/']); // Manda para o cardápio
      },
      error: (err) => {
        // Erro!
        console.error('Falha ao registrar retirada', err);
        alert('Houve um erro ao registrar sua retirada. Tente novamente.');
      }
    });
  }
}