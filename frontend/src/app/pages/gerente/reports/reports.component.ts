import { Component, OnInit } from '@angular/core';
import { WithdrawalService, ReportWithdrawal } from '../../../services/withdrawal.service'; 
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'; // Adicionamos Pipes aqui

// Interface para o componente de relatório, adicionando o campo de numeração de tela
interface DisplayReportWithdrawal extends ReportWithdrawal {
  displayIndex: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  // Importamos os Pipes para uso no template
  imports: [CommonModule, DatePipe, DecimalPipe], 
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  // Usamos a interface correta para tipagem e para incluir o displayIndex
  withdrawals: DisplayReportWithdrawal[] = []; 
  totalCostAll: number = 0;
  isLoading: boolean = true;

  constructor(private withdrawalService: WithdrawalService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.withdrawalService.getWithdrawalsReport().subscribe(data => { 
      // --- CORREÇÃO AQUI: Adiciona o displayIndex (começa em 1) ---
      this.withdrawals = data.map((w, index) => {
          const dateStringUTC = w.withdrawalDate + 'Z';
          return {
              ...w,
              withdrawalDate: new Date(dateStringUTC) as any,
              // Adiciona o índice de exibição
              displayIndex: index + 1 
          } as DisplayReportWithdrawal; // Força a nova tipagem
      }); 
      // -----------------------------------------------------------

      // Garante que o cálculo do custo total usa o array original
      this.totalCostAll = data.reduce((total: number, w: ReportWithdrawal) => total + w.totalCost, 0); 
      this.isLoading = false;
    });
  }
}