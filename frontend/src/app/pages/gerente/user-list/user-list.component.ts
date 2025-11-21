import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserDTO } from '../../../services/user.service';
import { WithdrawalService } from '../../../services/withdrawal.service';
import { LoadingService } from '../../../services/loading/loading.service'; 

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: UserDTO[] = [];
  errorMessage = '';

  // Controle de Carregamento da Tela Principal
  isLoading: boolean = true;

  // Controle do Modal de Histórico
  showHistoryModal = false;
  selectedUserHistory: any[] = [];
  selectedUserName = '';
  isLoadingHistory = false;
  
  // VARIÁVEL PARA O TOTAL GERAL
  totalHistoryValue: number = 0;

  constructor(
    private userService: UserService,
    private withdrawalService: WithdrawalService,
    private loadingService: LoadingService 
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true; 
    
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.filter(u => {
            const role = u.role ? u.role.toUpperCase() : '';
            return role !== 'GERENTE' && role !== 'ADMIN';
        });
        
        setTimeout(() => {
           this.isLoading = false;
        }, 500);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar usuários.';
        this.isLoading = false;
      }
    });
  }

  toggleStatus(user: UserDTO) {
    if (!confirm(`Deseja realmente ${user.active ? 'BLOQUEAR' : 'ATIVAR'} o usuário ${user.name}?`)) {
      return;
    }
    
    this.loadingService.show();

    this.userService.toggleUserStatus(user.id).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.loadingService.hide();
      },
      error: (err) => {
        alert('Erro ao alterar status.');
        this.loadingService.hide();
      }
    });
  }

  viewHistory(user: UserDTO) {
    this.selectedUserName = user.name;
    this.showHistoryModal = true;
    this.isLoadingHistory = true;
    this.selectedUserHistory = []; 
    this.totalHistoryValue = 0; // Reseta o valor ao abrir

    this.withdrawalService.getWithdrawalsByUserId(user.id).subscribe({
      next: (data) => {
        this.selectedUserHistory = data;
        // CALCULA O TOTAL ASSIM QUE OS DADOS CHEGAM
        this.calculateTotalHistory();
        this.isLoadingHistory = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico', err);
        this.isLoadingHistory = false;
      }
    });
  }

  // FUNÇÃO PARA SOMAR TUDO
  calculateTotalHistory() {
    // Soma o campo 'totalCost' de cada item do histórico
    this.totalHistoryValue = this.selectedUserHistory.reduce((acc, item) => acc + item.totalCost, 0);
  }

  closeModal() {
    this.showHistoryModal = false;
  }
}