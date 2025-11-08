import { Component, OnInit } from '@angular/core';
import { WithdrawalService, ReportWithdrawal } from '../../../services/withdrawal.service'; // ReportWithdrawal precisa ser usado
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  // CORRIGIDO: O template (HTML) espera 'withdrawals', mas o TS tinha 'reports'.
  // Renomeamos para 'reports' no TS, mas vamos manter a variável 'withdrawals' se o HTML usá-la muito.
  withdrawals: ReportWithdrawal[] = []; // Usaremos 'withdrawals' para bater com o HTML.
  totalCostAll: number = 0;
  isLoading: boolean = true;

  constructor(private withdrawalService: WithdrawalService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.withdrawalService.getWithdrawalsReport().subscribe(data => { // Chamada de função corrigida
      this.withdrawals = data; // Atribuição à variável que o HTML usa
      // CORRIGIDO: Adicionando tipagem para os parâmetros do reduce
      this.totalCostAll = data.reduce((total: number, w: ReportWithdrawal) => total + w.totalCost, 0); 
      this.isLoading = false;
    });
  }
}