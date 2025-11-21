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
  
  history: Withdrawal[] = []; 
  
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
        
        this.history = data.map((w, index) => { 
          const dateString = w.withdrawalDate ? w.withdrawalDate : new Date().toISOString();
          
          return {
            ...w,
            displayIndex: index + 1, 
            withdrawalDate: new Date(dateString) as any 
          };
        });

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