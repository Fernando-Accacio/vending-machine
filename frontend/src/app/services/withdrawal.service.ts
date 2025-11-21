import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

export interface CartItemDto {
  dishId: number;
  quantity: number;
}

export interface WithdrawalRequest {
  email: string;
  cart: CartItemDto[];
}

export interface Dish {
    id: number;
    name: string;
    custo: number;
}

export interface WithdrawalItem {
    id?: number;
    dish: Dish;
    quantity: number;
    costAtTime: number;
}

export interface Withdrawal {
    id: number;
    withdrawalDate: string; 
    totalCost: number;
    items: WithdrawalItem[];
    displayIndex?: number; 
    user?: { 
        id: number;
        name: string;
        email: string;
        documento: string;
    }; 
}

export type ReportWithdrawal = Withdrawal; 

@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {

  private apiUrl = environment.apiUrl + '/withdrawals'; 

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // --- MÉTODOS PRINCIPAIS ---

  createWithdrawal(withdrawalData: WithdrawalRequest): Observable<any> {
    return this.http.post(this.apiUrl, withdrawalData, this.getHeaders());
  }

  getAllWithdrawals(): Observable<Withdrawal[]> {
    return this.http.get<Withdrawal[]>(this.apiUrl, this.getHeaders());
  }

  getMyWithdrawals(): Observable<Withdrawal[]> {
    return this.http.get<Withdrawal[]>(`${this.apiUrl}/my-withdrawals`, this.getHeaders());
  }

  // Método chamado pelo Modal do Gerente
  getWithdrawalsByUserId(userId: number): Observable<Withdrawal[]> {
    return this.http.get<Withdrawal[]>(`${this.apiUrl}/user/${userId}`, this.getHeaders());
  }

  // --- MÉTODOS DE COMPATIBILIDADE ---
  getHistory(): Observable<Withdrawal[]> {
    return this.getMyWithdrawals();
  }

  getWithdrawalsReport(): Observable<Withdrawal[]> {
    return this.getAllWithdrawals();
  }
}