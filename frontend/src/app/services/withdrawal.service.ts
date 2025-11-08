import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// O import é para o objeto environment central
import { environment } from '../../environments/environment'; 

// --- INTERFACES DO BACKEND ---

export interface Dish {
    id: number;
    name: string;
    description: string;
    custo: number;
    tempoReposicao: number;
}

export interface WithdrawalItem {
    id: number;
    quantity: number;
    costAtTime: number;
    dish: Dish; 
}

export interface Withdrawal { 
    id: number;
    totalCost: number;
    withdrawalDate: string;
    user: {
        documento: string;
        name: string;
        email: string;
    };
    items: WithdrawalItem[];
}

export type ReportWithdrawal = Withdrawal; 

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

    // CORREÇÃO AQUI: Usamos environment.apiUrl diretamente
    private apiUrl = `${environment.apiUrl}/withdrawals`; 

    constructor(private http: HttpClient) {}

    createWithdrawal(request: WithdrawalRequest): Observable<Withdrawal> {
        return this.http.post<Withdrawal>(this.apiUrl, request);
    }

    getHistory(): Observable<Withdrawal[]> { // Função para o Cliente
        return this.http.get<Withdrawal[]>(`${this.apiUrl}/history`);
    }

    getWithdrawalsReport(): Observable<ReportWithdrawal[]> { // Função para o Gerente
        return this.http.get<ReportWithdrawal[]>(this.apiUrl); 
    }
}