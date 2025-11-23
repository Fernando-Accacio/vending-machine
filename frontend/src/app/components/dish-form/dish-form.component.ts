import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DishService, Dish } from '../../services/dish.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dish-form',
    templateUrl: './dish-form.component.html',
    styleUrls: ['./dish-form.component.css'],
    standalone: true,
    imports: [FormsModule, CommonModule]
})
export class DishFormComponent implements OnInit {
    
    @Input() dishId: number | null = null;
    
    isLoading: boolean = false;

    dish: Dish = {
        name: '',
        description: '',
        custo: 0, 
        tempoReposicao: 0,
        imageUrl: ''
    };
    
    isEdit: boolean = false;
    selectedFile: File | null = null;
    imageOption: 'link' | 'upload' = 'link';
    
    successMessage: string | null = null;
    errorMessage: string | null = null;

    private GERENTE_LISTA_ITENS_ROUTE = '/itens'; 
    private SUCCESS_DELAY_MS = 1500;

    constructor(
        private dishService: DishService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadDish(+id);
        } else if (this.dishId) {
            this.loadDish(this.dishId);
        }
    }

    loadDish(id: number) {
        this.isEdit = true;
        this.dishId = id;
        
        // ATIVA O LOADING AO BUSCAR DADOS
        this.isLoading = true;

        this.dishService.getDish(id).subscribe({
            next: (data: Dish) => {
                this.dish = data;
                this.imageOption = this.dish.imageUrl ? 'link' : 'upload';
                this.isLoading = false; // DESATIVA AO SUCESSO
            },
            error: (err) => {
                console.error(err);
                this.errorMessage = 'Erro ao carregar dados do item.';
                this.isLoading = false; // DESATIVA AO ERRO
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    saveDish() {
        this.successMessage = null;
        this.errorMessage = null;

        // ATIVA O LOADING AO SALVAR
        this.isLoading = true;

        const formData = new FormData();
        formData.append('name', this.dish.name);
        formData.append('description', this.dish.description);
        formData.append('custo', this.dish.custo.toString());
        formData.append('tempoReposicao', this.dish.tempoReposicao.toString());

        if (this.imageOption === 'upload' && this.selectedFile) {
            formData.append('file', this.selectedFile);
        } else if (this.imageOption === 'link' && this.dish.imageUrl) {
            formData.append('imageUrl', this.dish.imageUrl);
        }

        const operation = this.isEdit ? 
            this.dishService.updateDish(this.dishId!, formData) : 
            this.dishService.createDish(formData);

        const successMsg = this.isEdit 
            ? 'Item atualizado com sucesso! \u2713' 
            : 'Item adicionado com sucesso! \u2713';
        const errorMsg = this.isEdit ? 'Erro ao atualizar item.' : 'Erro ao adicionar item.';

        operation.subscribe({
            next: () => {
                this.isLoading = false; // DESATIVA
                this.successMessage = successMsg;
                setTimeout(() => {
                    this.goBack();
                }, this.SUCCESS_DELAY_MS);
            },
            error: (err) => {
                this.isLoading = false; // DESATIVA
                this.errorMessage = `${errorMsg} Verifique os logs.`;
                console.error(errorMsg, err);
            }
        });
    }

    goBack(): void {
        this.router.navigate([this.GERENTE_LISTA_ITENS_ROUTE]);
    }
}