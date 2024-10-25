import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from '../../../../core/services/api/role.service';
import Swal from 'sweetalert2';  // Importa SweetAlert2

@Component({
  selector: 'app-role-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-create.component.html',
})
export class RoleCreateComponent implements OnInit {
  role_name: string = '';  // Nombre del rol a crear

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createRole(): void {
    if (!this.role_name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del rol es requerido',
      });
      return;
    }

    const newRole = { role_name: this.role_name };

    this.roleService.createRole(newRole).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Rol ${this.role_name} ha sido creado exitosamente.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/roles']);
        });
      },
      (error) => {
        console.error('Error al crear el rol:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al crear el rol',
          text: 'Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/roles']);
  }
}
