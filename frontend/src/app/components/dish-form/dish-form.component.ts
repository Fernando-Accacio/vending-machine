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
    
    // VARIÁVEIS ADICIONADAS PARA MENSAGEM DE SUCESSO E ERRO
    successMessage: string | null = null;
    errorMessage: string | null = null;

    private GERENTE_LISTA_ITENS_ROUTE = '/itens'; 
    private SUCCESS_DELAY_MS = 1500; // 1.5 segundos de atraso

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
        this.dishService.getDish(id).subscribe((data: Dish) => {
            this.dish = data;
            // Define a opção de imagem correta ao carregar
            this.imageOption = this.dish.imageUrl ? 'link' : 'upload';
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    saveDish() {
        this.successMessage = null; // Limpa mensagens antigas
        this.errorMessage = null;

        const formData = new FormData();
        formData.append('name', this.dish.name);
        formData.append('description', this.dish.description);
        formData.append('custo', this.dish.custo.toString());
        formData.append('tempoReposicao', this.dish.tempoReposicao.toString());

        // Lógica de Imagem
        if (this.imageOption === 'upload' && this.selectedFile) {
            formData.append('file', this.selectedFile);
        } else if (this.imageOption === 'link' && this.dish.imageUrl) {
            formData.append('imageUrl', this.dish.imageUrl);
        }
        // Se for upload e não tem selectedFile, e não está editando, assume que não tem imagem
        // Se for edição e selectedFile for null, o backend deve manter o imageUrl existente.

        const operation = this.isEdit ? 
            this.dishService.updateDish(this.dishId!, formData) : 
            this.dishService.createDish(formData);

        const successMsg = this.isEdit 
    ? 'Item atualizado com sucesso! \u2713' 
    : 'Item adicionado com sucesso! \u2713';
        const errorMsg = this.isEdit ? 'Erro ao atualizar item.' : 'Erro ao adicionar item.';

        operation.subscribe({
            next: () => {
                this.successMessage = successMsg;
                // Espera um pouco antes de navegar para a mensagem ser lida
                setTimeout(() => {
                    this.goBack();
                }, this.SUCCESS_DELAY_MS);
            },
            error: (err) => {
                this.errorMessage = `${errorMsg} Verifique os logs.`;
                console.error(errorMsg, err);
            }
        });
    }

    goBack(): void {
        this.router.navigate([this.GERENTE_LISTA_ITENS_ROUTE]);
    }
}