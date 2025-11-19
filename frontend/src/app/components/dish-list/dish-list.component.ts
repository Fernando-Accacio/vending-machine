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
  public isLoading: boolean = true; // (Começa em true)

  constructor(private dishService: DishService) {}

  ngOnInit(): void {
    this.loadDishes();
  }

  loadDishes() {
    this.isLoading = true; // (Garante o loading em re-carregamentos)
    
    this.dishService.getDishes().subscribe({ // (para objeto)
      next: (data: Dish[]) => {
        this.dishes = data;
        this.isLoading = false; // (Desliga no sucesso)
      },
      error: (err) => { // -> NOVO
        console.error("Erro ao carregar itens:", err);
        this.isLoading = false; // (Desliga no erro)
      }
    });
  }

  deleteDish(id: number) {
    const shouldDelete = confirm("Tem certeza que deseja apagar este item? Esta ação fará um 'soft delete' do item.");

    if (shouldDelete) {
        this.dishService.deleteDish(id).subscribe({
            next: () => {
                alert('Item deletado com sucesso!');
                this.loadDishes(); // Isso vai reativar o loading
            },
            error: (error) => {
                alert('Não é possível excluir o item. Se ele estiver vinculado a um pedido, ele será marcado como Inativo.');
                console.error('Erro ao excluir o item:', error);
            },
        });
    }
  }
}