import { Component, OnInit } from '@angular/core';
import { WithdrawalService, ReportWithdrawal } from '../../../services/withdrawal.service'; 
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'; 

interface DisplayReportWithdrawal extends ReportWithdrawal {
  displayIndex: number;
  user: NonNullable<ReportWithdrawal['user']>; 
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe], 
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  withdrawals: DisplayReportWithdrawal[] = []; 
  totalCostAll: number = 0;
  
  isLoading: boolean = true; 

  constructor(private withdrawalService: WithdrawalService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true; 

    this.withdrawalService.getWithdrawalsReport().subscribe({
      next: (data) => {
        this.withdrawals = data.map((w, index) => {
          
          const dateString = w.withdrawalDate;
          
          const userSafe = w.user || { 
            id: 0, 
            name: 'Usuário Removido', 
            email: '', 
            documento: '---' 
          };

          return {
            ...w,
            user: userSafe,
            withdrawalDate: new Date(dateString) as any,
            displayIndex: index + 1 
          } as DisplayReportWithdrawal;
        }); 

        this.totalCostAll = data.reduce((total: number, w: ReportWithdrawal) => total + w.totalCost, 0); 
        this.isLoading = false; 
      },
      error: (err) => {
        console.error("Erro ao carregar relatórios:", err);
        this.isLoading = false; 
      }
    });
  }
}