import { Component, OnInit } from '@angular/core';
import { DishService, Dish } from '../../services/dish.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DishListComponent implements OnInit {
  dishes: Dish[] = [];
  public isLoading: boolean = true;

  // NOVAS VARIÁVEIS PARA AS MENSAGENS
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private dishService: DishService) {}

  ngOnInit(): void {
    this.loadDishes();
  }

  loadDishes() {
    this.isLoading = true;
    
    this.dishService.getDishes().subscribe({
      next: (data: Dish[]) => {
        this.dishes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erro ao carregar itens:", err);
        this.isLoading = false;
      }
    });
  }

  deleteDish(id: number) {
    // 1. Pergunta de confirmação
    const shouldDelete = confirm("Tem certeza que deseja EXCLUIR este item? \n\nSe ele nunca foi vendido, sumirá do banco de dados. \nSe já tiver histórico, ficará apenas inativo.");

    if (shouldDelete) {
        // Limpa mensagens anteriores
        this.successMessage = null;
        this.errorMessage = null;

        this.dishService.deleteDish(id).subscribe({
            next: () => {
                // 2. Exibe a mensagem de sucesso (VERDE)
                this.successMessage = 'Item excluído com sucesso! \u2713';
                
                // 3. Recarrega a lista
                this.loadDishes(); 

                // 4. Remove a mensagem após 3 segundos
                setTimeout(() => {
                    this.successMessage = null;
                }, 3000);
            },
            error: (error) => {
                // Exibe mensagem de erro (VERMELHO) caso falhe
                this.errorMessage = 'Erro ao tentar excluir o item.';
                console.error('Erro ao excluir o item:', error);
                
                setTimeout(() => {
                    this.errorMessage = null;
                }, 3000);
            },
        });
    }
  }
}