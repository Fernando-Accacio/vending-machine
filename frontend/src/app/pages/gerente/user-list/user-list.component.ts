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
  
  // Mensagens de Feedback (Toast)
  successMessage: string | null = null;
  errorMessage: string | null = null;

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
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  toggleStatus(user: UserDTO) {
    const actionText = user.active ? 'BLOQUEAR' : 'REATIVAR';
    
    // 1. Confirmação
    if (!confirm(`Deseja realmente ${actionText} o usuário ${user.name}?`)) {
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

        // 2. Define a mensagem de sucesso baseada no status novo
        const statusMsg = updatedUser.active ? 'reativado' : 'bloqueado';
        this.successMessage = `Usuário ${statusMsg} com sucesso! \u2713`;

        // 3. Remove a mensagem após 3 segundos
        setTimeout(() => {
            this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.loadingService.hide();
        this.errorMessage = 'Erro ao alterar status do usuário.';
        
        setTimeout(() => {
            this.errorMessage = null;
        }, 3000);
      }
    });
  }

  viewHistory(user: UserDTO) {
    this.selectedUserName = user.name;
    this.showHistoryModal = true;
    this.isLoadingHistory = true;
    this.selectedUserHistory = []; 
    this.totalHistoryValue = 0; 

    this.withdrawalService.getWithdrawalsByUserId(user.id).subscribe({
      next: (data) => {
        this.selectedUserHistory = data;
        this.calculateTotalHistory();
        this.isLoadingHistory = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico', err);
        this.isLoadingHistory = false;
      }
    });
  }

  calculateTotalHistory() {
    this.totalHistoryValue = this.selectedUserHistory.reduce((acc, item) => acc + item.totalCost, 0);
  }

  closeModal() {
    this.showHistoryModal = false;
  }
}