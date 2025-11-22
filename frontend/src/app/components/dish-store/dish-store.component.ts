import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishService, Dish } from '../../services/dish.service'; 
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/auth/authenticate.service';
import { WithdrawalService, CartItemDto, WithdrawalRequest } from '../../services/withdrawal.service';
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

  public isLoadingLocal: boolean = false; 

  // NOVAS VARIÁVEIS PARA MENSAGENS
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private dishService: DishService, 
    private router: Router,
    private authService: AuthenticateService, 
    private withdrawalService: WithdrawalService,
    private loadingService: LoadingService 
  ) {}

  ngOnInit(): void {
    this.loadDishes(); 
    this.updateTotal(); 
  }

  loadDishes(): void {
    this.isLoadingLocal = true; 

    if (this.loadingService.isFirstLoad()) {
      this.loadingService.show();
    }

    this.dishService.getDishes().subscribe({
        next: (data: Dish[]) => {
            this.dishes = data;
        },
        error: (err) => {
            console.error('Erro ao carregar itens:', err);
            if (this.loadingService.isFirstLoad()) {
              this.loadingService.hide(); 
            }
            this.isLoadingLocal = false; 
            this.loadingService.completeFirstLoad(); 
        },
        complete: () => {
             if (this.loadingService.isFirstLoad()) {
              this.loadingService.hide(); 
            }
            this.isLoadingLocal = false; 
            this.loadingService.completeFirstLoad(); 
        }
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

  checkout(): void {
    // 1. Verifica Login
    if (!this.authService.isAuthenticated()) {
      this.errorMessage = 'Você precisa estar logado para finalizar!';
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }
    
    const email = this.authService.getEmail(); 
    if (!email) {
        this.errorMessage = 'Erro de autenticação. Faça login novamente.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
        return;
    }

    const cartDto: CartItemDto[] = this.cart
      .filter(item => item.id !== undefined)
      .map(item => ({
        dishId: item.id!,
        quantity: item.quantity
      }));

    const request: WithdrawalRequest = {
      email: email,
      cart: cartDto
    };

    this.isLoadingLocal = true;
    this.loadingService.show();
    
    this.withdrawalService.createWithdrawal(request).subscribe({
      next: (response) => {
        // 3. SUCESSO: Exibe a mensagem verde
        this.successMessage = 'Retirada confirmada com sucesso! \u2713';
        
        // Limpa carrinho e local storage
        this.cart = [];
        this.updateTotal();
        localStorage.removeItem('cart');

        this.loadingService.hide();
        
        // 4. Redireciona após 2 segundos (para dar tempo de ler a mensagem)
        setTimeout(() => {
            this.isLoadingLocal = false;
            this.successMessage = null; // Limpa msg
            this.router.navigate(['/']); // Vai para Home ou Meus Pedidos
        }, 2000);
      },
      error: (err) => {
        console.error('Falha ao registrar retirada', err);
        this.loadingService.hide();
        this.isLoadingLocal = false; 
        
        // ERRO: Exibe mensagem vermelha
        this.errorMessage = 'Erro ao processar retirada. Tente novamente.';
        setTimeout(() => this.errorMessage = null, 3000);
      },
      complete: () => {
        // O loading é controlado no next/error para evitar piscar
      }
    });
  }
}