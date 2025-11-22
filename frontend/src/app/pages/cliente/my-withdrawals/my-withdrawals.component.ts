import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { WithdrawalService, Withdrawal } from '../../../services/withdrawal.service'; 
import { AuthenticateService } from '../../../services/auth/authenticate.service';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-my-withdrawals',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, DecimalPipe],
  templateUrl: './my-withdrawals.component.html',
  styleUrl: './my-withdrawals.component.css'
})
export class MyWithdrawalsComponent implements OnInit {
  
  history: any[] = []; // Mudei para any[] para aceitar o displayIndex sem erro de tipagem
  
  isLoading: boolean = true;
  errorMessage: string | null = null;
  
  constructor(
    private withdrawalService: WithdrawalService,
    private authService: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.withdrawalService.getHistory().subscribe({
      next: (data: Withdrawal[]) => {
        
        // 1. Formata as datas corretamente
        let formattedData = data.map((w) => { 
          const dateString = w.withdrawalDate ? w.withdrawalDate : new Date().toISOString();
          return {
            ...w,
            withdrawalDate: new Date(dateString) as any
          };
        });

        // 2. Ordena: Mais recentes primeiro
        formattedData = formattedData.sort((a: any, b: any) => {
            return b.withdrawalDate.getTime() - a.withdrawalDate.getTime();
        });

        // 3. A MÁGICA: Calcula o ID Sequencial do Cliente
        // Se tenho 10 itens, o item no índice 0 (o mais novo) recebe o número 10.
        const totalCount = formattedData.length;

        this.history = formattedData.map((item, index) => ({
            ...item,
            // O ID Visual será: (Total de itens - Posição atual)
            // Ex: Total 5. Item 0 (mais novo) vira #5. Item 4 (mais velho) vira #1.
            displayIndex: totalCount - index 
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar histórico:', err);
        this.errorMessage = "Falha ao carregar histórico.";
        this.isLoading = false;
      }
    });
  }
}