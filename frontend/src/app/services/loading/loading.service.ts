import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // BehaviorSubject para emitir o estado atual e o valor inicial (false)
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  // Observable público para que os componentes (como AppComponent) possam se inscrever
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  // --- LÓGICA ATUALIZADA ---
  // Flag para rastrear o primeiro carregamento (cold start)
  private _isFirstLoad: boolean = true;
  // --- FIM DA ATUALIZAÇÃO ---

  constructor() { }

  // Método para exibir a tela de carregamento
  show(): void {
    this.loadingSubject.next(true);
  }

  // Método para esconder a tela de carregamento
  hide(): void {
    this.loadingSubject.next(false);
  }

  // --- NOVOS MÉTODOS ADICIONADOS ---

  /**
   * Verifica se é o primeiro carregamento (cold start)
   */
  isFirstLoad(): boolean {
    return this._isFirstLoad;
  }

  /**
   * Marca o primeiro carregamento como concluído
   */
  completeFirstLoad() {
    this._isFirstLoad = false;
  }
}