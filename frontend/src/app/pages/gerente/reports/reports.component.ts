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
  // Usaremos 'withdrawals' para bater com o HTML e converter a data.
  withdrawals: any[] = []; // Usaremos any[] temporariamente para conversão de data
  totalCostAll: number = 0;
  isLoading: boolean = true;

  constructor(private withdrawalService: WithdrawalService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.withdrawalService.getWithdrawalsReport().subscribe(data => { // Chamada de função corrigida
        // CORRIGIDO: Conversão de data para objeto Date, como no componente do cliente
        this.withdrawals = data.map(w => ({
            ...w,
            withdrawalDate: new Date(w.withdrawalDate) as any
        })); 

        // CORRIGIDO: Adicionando tipagem para os parâmetros do reduce
      this.totalCostAll = data.reduce((total: number, w: ReportWithdrawal) => total + w.totalCost, 0); 
      this.isLoading = false;
    });
  }
}