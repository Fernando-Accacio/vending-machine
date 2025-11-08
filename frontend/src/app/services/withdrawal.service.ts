import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getUrl } from './config/env';

// (Vamos recriar as interfaces aqui para o relatório)

// O que esperamos de um item no relatório
export interface ReportItem {
  id: number;
  dish: {
    name: string;
    custo: number;
  };
  quantity: number;
  costAtTime: number;
}

// O que esperamos de uma retirada (Withdrawal) no relatório
export interface ReportWithdrawal {
  id: number;
  user: {
    name: string;
    documento: string;
  };
  items: ReportItem[];
  totalCost: number;
  withdrawalDate: string; // O JSON da data virá como string
}


// DTO para CRIAR uma retirada
export interface CartItemDto {
  dishId: number;
  quantity: number;
}
export interface WithdrawalRequest {
  email: string;
  cart: CartItemDto[];
}


@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {
  
  private apiUrl = getUrl() + '/withdrawals'; // O endpoint base

  constructor(private http: HttpClient) { }

  /**
   * (O que já fizemos)
   * Salva uma nova retirada no banco
   */
  createWithdrawal(request: WithdrawalRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  //
  // --- MÉTODO NOVO ADICIONADO AQUI ---
  //
  /**
   * Busca a lista de todas as retiradas para o relatório
   */
  getWithdrawals(): Observable<ReportWithdrawal[]> {
    return this.http.get<ReportWithdrawal[]>(this.apiUrl);
  }
}