import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../../../core/services/api/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-update.component.html',
})
export class RoleUpdateComponent implements OnInit {
  role_name: string = '';  // Nombre del rol a editar
  roleId: number = 0;  // ID del rol a editar

  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.roleId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchRoleById();
  }

  fetchRoleById(): void {
    this.roleService.getRoleById(this.roleId).subscribe(
      (response) => {
        this.role_name = response.result.role_name;
      },
      (error) => {
        console.error('Error al obtener el rol:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los detalles del rol',
        });
      }
    );
  }

  updateRole(): void {
    if (!this.role_name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del rol es requerido',
      });
      return;
    }

    const updatedRole = { role_name: this.role_name };

    this.roleService.updateRole(this.roleId, updatedRole).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Rol actualizado exitosamente!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/roles']);
        });
      },
      (error) => {
        console.error('Error al actualizar el rol:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al actualizar el rol',
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
