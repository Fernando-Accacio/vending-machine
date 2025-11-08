import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Precisamos do DatePipe
import { WithdrawalService, ReportWithdrawal } from '../../../services/withdrawal.service'; // Nosso serviço

@Component({
  selector: 'app-reports', // O "apelido"
  standalone: true,
  imports: [CommonModule, DatePipe], // Importamos o CommonModule e o DatePipe
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  public withdrawals: ReportWithdrawal[] = [];
  public totalCostAll: number = 0;

  constructor(private withdrawalService: WithdrawalService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.withdrawalService.getWithdrawals().subscribe(data => {
      this.withdrawals = data;
      // Calcula o custo total de todas as retiradas
      this.totalCostAll = data.reduce((total, w) => total + w.totalCost, 0);
    });
  }
}