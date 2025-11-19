import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DishService, Dish } from '../../services/dish.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';

@Component({
    selector: 'app-dish-form',
    templateUrl: './dish-form.component.html',
    styleUrls: ['./dish-form.component.css'],
    standalone: true,
    imports: [FormsModule, CommonModule]
})
export class DishFormComponent implements OnInit {
    
    // Adicionado Input para compatibilidade com a versão anterior
    @Input() dishId: number | null = null;
    
    dish: Dish = {
        id: 0,
        name: '',
        description: '',
        custo: 0, 
        tempoReposicao: 0 
    };
    
    isEdit: boolean = false;

    private GERENTE_LISTA_ITENS_ROUTE = '/itens'; 

    constructor(
        private dishService: DishService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.dishService.getDish(+id).subscribe((data: Dish) => {
                this.dish = data;
            });
            // Atualiza o dishId se vier da rota
            this.dishId = +id;
        } else if (this.dishId) {
             // Caso o id tenha sido passado como Input e não como parâmetro de rota
             this.isEdit = true;
        }
    }

    saveDish() {
        if (this.isEdit) {
            this.dishService.updateDish(this.dish.id!, this.dish).subscribe({
                next: () => {
                    // Volta para a tela de gerenciamento de itens do Gerente
                    this.router.navigate([this.GERENTE_LISTA_ITENS_ROUTE]); 
                    console.log('Item atualizado com sucesso!');
                },
                error: (err) => {
                    console.error('Erro ao atualizar item:', err);
                }
            });
        } else {
            this.dishService.createDish(this.dish).subscribe({
                next: () => {
                    // Volta para a tela de gerenciamento de itens do Gerente
                    this.router.navigate([this.GERENTE_LISTA_ITENS_ROUTE]);
                    console.log('Item registrado com sucesso!');
                },
                error: (err) => {
                    console.error('Erro ao registrar item:', err);
                }
            });
        }
    }

    // Implementação da função goBack() para o botão Voltar no HTML
    goBack(): void {
        // Redireciona para a tela de gerenciamento de itens do Gerente.
        this.router.navigate([this.GERENTE_LISTA_ITENS_ROUTE]);
    }
}