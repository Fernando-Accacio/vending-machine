import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithdrawalService, Withdrawal } from '../../../services/withdrawal.service'; 
import { AuthenticateService } from '../../../services/auth/authenticate.service';

@Component({
  selector: 'app-my-withdrawals',
  standalone: true,
  imports: [CommonModule],
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
    if (this.authService.isAuthenticated()) {
      this.loadHistory();
    } else {
      this.errorMessage = "Faça login para ver seu histórico.";
      this.isLoading = false;
    }
  }

  loadHistory(): void {
    this.withdrawalService.getHistory().subscribe({
      next: (data) => {
        this.history = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar histórico:', err);
        this.errorMessage = "Falha ao carregar histórico. Por favor, tente novamente.";
        this.isLoading = false;
      }
    });
  }
}