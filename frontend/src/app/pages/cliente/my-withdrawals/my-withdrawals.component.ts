import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { WithdrawalService, Withdrawal } from '../../../services/withdrawal.service'; 
import { AuthenticateService } from '../../../services/auth/authenticate.service';
import { RouterModule } from '@angular/router'; 

// Interface temporária para estender Withdrawal com o índice de exibição
// Isso ajuda o TypeScript a reconhecer a nova propriedade
interface DisplayWithdrawal extends Withdrawal {
  displayIndex: number; 
}

@Component({
  selector: 'app-my-withdrawals',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, DecimalPipe],
  templateUrl: './my-withdrawals.component.html',
  styleUrl: './my-withdrawals.component.css'
})
export class MyWithdrawalsComponent implements OnInit {
  history: DisplayWithdrawal[] = []; // Usamos a nova interface
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
        // --- CORREÇÃO AQUI: Adiciona o displayIndex ---
        // O segundo parâmetro do 'map' é o índice (começa em 0)
        this.history = data.map((w, index) => { 
          const dateStringUTC = w.withdrawalDate + 'Z';
          return {
            ...w,
            // O índice de exibição será 1, 2, 3...
            displayIndex: index + 1, 
            withdrawalDate: new Date(dateStringUTC) as any 
          } as DisplayWithdrawal;
        });
        // ---------------------------------------------

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar histórico (pós-interceptor):', err);
        this.errorMessage = "Falha ao carregar histórico. Verifique a conexão ou status do servidor.";
        this.isLoading = false;
      }
    });
  }
}