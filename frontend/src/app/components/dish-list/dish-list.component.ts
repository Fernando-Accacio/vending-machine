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

  constructor(private dishService: DishService) {}

  ngOnInit(): void {
    this.loadDishes();
  }

  loadDishes() {
    this.dishService.getDishes().subscribe((data: Dish[]) => {
      this.dishes = data;
    });
  }

  // --- CORREÇÃO: ADICIONANDO O POP-UP DE CONFIRMAÇÃO ---
  deleteDish(id: number) {
    // ⚠️ Importante: Não use window.confirm() em produção, mas para testes é rápido.
    // Em um app de verdade, usaria um modal.
    const shouldDelete = confirm("Tem certeza que deseja apagar este item? Esta ação fará um 'soft delete' do item.");

    if (shouldDelete) {
        this.dishService.deleteDish(id).subscribe({
            next: () => {
                alert('Prato deletado com sucesso!');
                this.loadDishes();
            },
            error: (error) => {
                // A mensagem de erro sugere que a exclusão falha se o prato estiver vinculado.
                alert('Não é possível excluir o prato. Se ele estiver vinculado a um pedido, ele será marcado como Inativo.');
                console.error('Erro ao excluir o prato:', error);
            },
        });
    }
  }
}