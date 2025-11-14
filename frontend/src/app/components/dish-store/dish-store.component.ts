import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishService, Dish } from '../../services/dish.service'; 
import { Router } from '@angular/router';

// --- NOVAS IMPORTAÇÕES ---
import { AuthenticateService } from '../../services/auth/authenticate.service';
import { WithdrawalService, CartItemDto, WithdrawalRequest } from '../../services/withdrawal.service';
// NOVO: Importe o LoadingService
import { LoadingService } from '../../services/loading/loading.service'; 

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
    private authService: AuthenticateService, 
    private withdrawalService: WithdrawalService,
    // NOVO: Injete o LoadingService
    private loadingService: LoadingService 
  ) {}

  ngOnInit(): void {
    this.loadDishes();
    this.updateTotal(); 
  }

  loadDishes(): void {
    // 1. ATIVA O LOADING antes da busca de dados
    this.loadingService.show();

    this.dishService.getDishes().subscribe({
        next: (data: Dish[]) => {
            this.dishes = data;
        },
        error: (err) => {
            console.error('Erro ao carregar pratos:', err);
        },
        complete: () => {
            // 2. DESATIVA O LOADING, independentemente do resultado
            this.loadingService.hide();
        }
    });
  }

  // ... (o restante dos métodos permanece o mesmo)
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

  checkout(): void {
    if (!this.authService.isAuthenticated()) {
      alert('Você precisa estar logado para finalizar uma retirada!');
      this.router.navigate(['/login']); 
      return;
    }
    
    const email = this.authService.getEmail(); 
    if (!email) {
        alert('Erro de autenticação: Email não encontrado no token. Tente fazer login novamente.');
        this.router.navigate(['/login']); 
        return;
    }

    const cartDto: CartItemDto[] = this.cart.map(item => ({
      dishId: item.id,
      quantity: item.quantity
    }));

    const request: WithdrawalRequest = {
      email: email,
      cart: cartDto
    };

    // 3. ATIVA LOADING antes do checkout (opcional, mas recomendado)
    this.loadingService.show();
    
    this.withdrawalService.createWithdrawal(request).subscribe({
      next: (response) => {
        alert('Retirada registrada com sucesso!');
        this.cart = [];
        this.updateTotal();
        localStorage.removeItem('cart');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Falha ao registrar retirada', err);
        alert('Houve um erro ao registrar sua retirada. Tente novamente.');
      },
      complete: () => {
        // 4. DESATIVA LOADING após o checkout
        this.loadingService.hide();
      }
    });
  }
}