import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/api/user.service';
import { User } from '../../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Profesor' },
    { id: 3, name: 'Estudiante' },
  ];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  usernameFilter: string = '';
  fullNameFilter: string = '';
  mailFilter: string = '';
  dniFilter: string = '';
  roleIdFilter?: number;

  showFilters: boolean = false;
  showDialog: boolean = false;
  dialogTitle: string = '';
  dialogMessage: string = '';
  selectedUserId?: number;

  sortBy: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  createUser(): void {
    this.router.navigate(['/users/create']);
  }

  resetFilters(): void {
    this.usernameFilter = '';
    this.fullNameFilter = '';
    this.mailFilter = '';
    this.dniFilter = '';
    this.roleIdFilter = undefined;
    this.currentPage = 1;
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers(
      this.currentPage,
      this.itemsPerPage,
      this.usernameFilter,
      this.fullNameFilter,
      this.mailFilter,
      this.dniFilter,
      this.roleIdFilter
    ).subscribe(
      (response) => {
        this.totalItems = response.result.length;
        this.users = response.result;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchUsers();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchUsers();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUsers();
    }
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1;
    this.fetchUsers();
  }

  toggleSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.fetchUsers();
  }

  editUser(id: number): void {
    this.router.navigate(['/users/update', id]);
  }

  deleteUser(id: number): void {
    this.dialogTitle = 'Confirmar Eliminación';
    this.dialogMessage = '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.';
    this.selectedUserId = id;
    this.showDialog = true;
  }

  onConfirmDialog(): void {
    if (this.selectedUserId !== undefined) {
      this.userService.deleteUser(this.selectedUserId).subscribe(() => {
        this.fetchUsers();
      });
    }
    this.showDialog = false;
  }

  onCancelDialog(): void {
    this.showDialog = false;
  }

  toggleDetails(index: number): void {
    this.users[index].showDetails = !this.users[index].showDetails;
  }
}
