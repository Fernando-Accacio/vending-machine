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

  constructor() { }

  // Método para exibir a tela de carregamento
  show(): void {
    this.loadingSubject.next(true);
  }

  // Método para esconder a tela de carregamento
  hide(): void {
    this.loadingSubject.next(false);
  }
}