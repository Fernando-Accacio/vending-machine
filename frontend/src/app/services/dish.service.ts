// src/app/services/dish.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getUrl } from './config/env'; // Usando sua configuração de URL

// 1. ATUALIZAMOS A INTERFACE
export interface Dish {
  id: number;
  name: string;
  description: string;
  custo: number; // Mudou de 'price' para 'custo'
  tempoReposicao: number; // Adicionamos o 'tempoReposicao'
}

@Injectable({
  providedIn: 'root'
})
export class DishService {
  
  // A URL base vem do seu arquivo 'env.ts' (ex: http://localhost:8081)
  private apiUrl = `${getUrl()}/dishes`; 

  constructor(private http: HttpClient) {}

  // Buscar todos os pratos (agora "Itens")
  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.apiUrl);
  }

  // Buscar um prato (Item) por ID
  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/${id}`);
  }

  // Criar novo prato (Item)
  createDish(dish: Omit<Dish, 'id'>): Observable<Dish> {
    return this.http.post<Dish>(this.apiUrl, dish);
  }

  // Atualizar prato (Item)
  updateDish(id: number, dish: Partial<Dish>): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/${id}`, dish);
  }

  // Deletar prato (Item)
  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}