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
  isLoading: boolean = true; // <--- Começa travado

  // Controle do Modal de Histórico
  showHistoryModal = false;
  selectedUserHistory: any[] = [];
  selectedUserName = '';
  isLoadingHistory = false;

  constructor(
    private userService: UserService,
    private withdrawalService: WithdrawalService,
    private loadingService: LoadingService 
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    // Note: Se você quiser usar SÓ essa tela branca e não o spinner global, 
    // pode remover o loadingService.show() daqui. 
    // Vou deixar os dois por segurança, mas a tela branca terá prioridade visual.
    this.isLoading = true; 
    
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.filter(u => {
            const role = u.role ? u.role.toUpperCase() : '';
            return role !== 'GERENTE' && role !== 'ADMIN';
        });
        
        // Simula um pequeno delay (opcional) para não piscar muito rápido se a net for veloz
        setTimeout(() => {
           this.isLoading = false; // <--- Libera a tela
        }, 500);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar usuários.';
        this.isLoading = false; // <--- Libera a tela para mostrar o erro
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

    this.withdrawalService.getWithdrawalsByUserId(user.id).subscribe({
      next: (data) => {
        this.selectedUserHistory = data;
        this.isLoadingHistory = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico', err);
        this.isLoadingHistory = false;
      }
    });
  }

  closeModal() {
    this.showHistoryModal = false;
  }
}