import { Component, OnInit } from '@angular/core';
import { WithdrawalService, ReportWithdrawal } from '../../../services/withdrawal.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  withdrawals: any[] = []; // Usamos 'any[]' para permitir a conversão de data
  totalCostAll: number = 0;
  isLoading: boolean = true;

  constructor(private withdrawalService: WithdrawalService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.withdrawalService.getWithdrawalsReport().subscribe(data => { 
        this.withdrawals = data.map(w => {
            const dateStringUTC = w.withdrawalDate + 'Z';
            return {
                ...w,
                withdrawalDate: new Date(dateStringUTC) as any
            };
        }); 

      this.totalCostAll = data.reduce((total: number, w: ReportWithdrawal) => total + w.totalCost, 0); 
      this.isLoading = false;
    });
  }
}