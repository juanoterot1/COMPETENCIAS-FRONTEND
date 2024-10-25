import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RoleService } from '../../../../core/services/api/role.service';
import { Role } from '../../../../core/models/role.model';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './role-list.component.html',
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  roleNameFilter: string = '';

  sortBy: 'id' | 'role_name' = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  showFilters: boolean = false;

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRoles();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  navigateToCreateRole(): void {
    this.router.navigate(['/roles/create']);
  }

  fetchRoles(): void {
    this.roleService.getRoles(this.roleNameFilter).subscribe(
      (response) => {
        this.roles = response.result;
        this.totalItems = this.roles.length;
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchRoles();
  }

  resetFilters(): void {
    this.roleNameFilter = '';
    this.applyFilters();
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1;
    this.fetchRoles();
  }

  toggleSort(field: 'id' | 'role_name'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.fetchRoles();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchRoles();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRoles();
    }
  }

  viewRole(roleId: number): void {
    this.router.navigate([`/roles/update/${roleId}`]); // Redirige a la página de actualización del rol
  }

  deleteRole(role: Role): void {
    Swal.fire({
      title: `¿Eliminar el rol ${role.role_name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(role.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Rol ${role.role_name} eliminado.`,
              showConfirmButton: false,
              timer: 1500
            });
            this.roles = this.roles.filter(r => r.id !== role.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar rol',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok'
            });
            console.error('Error al eliminar rol:', error);
          }
        );
      }
    });
  }

  exportToExcel(): void {
    const exportData = this.roles.map(role => ({
      ID: role.id,
      'Role Name': role.role_name,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');
    XLSX.writeFile(workbook, 'roles.xlsx');
  }
}
