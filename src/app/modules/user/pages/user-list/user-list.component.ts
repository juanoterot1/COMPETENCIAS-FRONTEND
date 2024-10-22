import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/api/user.service';
import { RoleService } from '../../../../core/services/api/role.service';
import { User } from '../../../../core/models/user.model';
import { Role } from '../../../../core/models/role.model';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  usernameFilter: string = '';
  fullNameFilter: string = '';  // Filtro de full_name
  emailFilter: string = '';
  phoneNumberFilter: string = ''; // Filtro para el número de teléfono
  roleFilter?: number;

  sortBy: 'id' | 'username' | 'full_name' | 'phone_number' = 'id';  // Agregar phone_number a la clasificación
  sortDirection: 'asc' | 'desc' = 'asc';

  showFilters: boolean = false;
  showDeleteModal: boolean = false;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  navigateToCreateUser(): void {
    this.router.navigate(['/users/create']);
  }

  fetchUsers(): void {
    this.userService.getUsers(this.usernameFilter, this.emailFilter, this.fullNameFilter, this.roleFilter, this.phoneNumberFilter).subscribe(
      (response) => {
        this.users = response.result;
        this.totalItems = this.users.length;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchRoles(): void {
    this.roleService.getRoles().subscribe(
      (response) => {
        this.roles = response.result;
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchUsers();
  }

  resetFilters(): void {
    this.usernameFilter = '';
    this.fullNameFilter = '';  // Restablecer filtro full_name
    this.emailFilter = '';
    this.phoneNumberFilter = ''; // Restablecer filtro de número de teléfono
    this.roleFilter = undefined;
    this.applyFilters();
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1;
    this.fetchUsers();
  }

  toggleSort(field: 'id' | 'username' | 'full_name' | 'phone_number'): void {  // Agregar opción phone_number
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
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

  viewUser(userId: number): void {
    this.router.navigate([`/users/update/${userId}`]);
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: `¿Eliminar al usuario ${user.username}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Usuario ${user.username} eliminado.`,
              showConfirmButton: false,
              timer: 1500
            });
            this.users = this.users.filter(u => u.id !== user.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar usuario',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok'
            });
            console.error('Error al eliminar usuario:', error);
          }
        );
      }
    });
  }

  // Método para exportar a Excel
  exportToExcel(): void {
    // Convertir la lista de usuarios a un array de objetos planos
    const exportData = this.users.map(user => ({
      ID: user.id,
      Username: user.username,
      'Full Name': user.full_name,
      Email: user.email,
      'Phone Number': user.phone_number, // Agregar número de teléfono
      Role: user.role?.name || 'Sin Rol'
    }));

    // Crear una hoja de cálculo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Establecer el ancho de las columnas
    const columnWidths = [
      { wpx: 50 },  // ID
      { wpx: 150 }, // Username
      { wpx: 200 }, // Full Name
      { wpx: 200 }, // Email
      { wpx: 120 }, // Phone Number
      { wpx: 100 }  // Role
    ];
    worksheet['!cols'] = columnWidths;

    // Aplicar estilos a las celdas de encabezado
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center" }
      };
    }

    // Aplicar bordes a todas las celdas de datos
    for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            ...worksheet[cellAddress].s,
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } }
            }
          };
        }
      }
    }

    // Crear un libro de trabajo de Excel
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, 'evaluadores.xlsx');
  }
}
