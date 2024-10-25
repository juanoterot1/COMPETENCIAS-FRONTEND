import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
// import { RoleService } from '../../../../core/services/api/role.service';  // Cambia a RoleService si tienes el servicio de roles

@Component({
  selector: 'app-role-detail', 
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './role-detail.component.html',
})
export class RoleDetailComponent implements OnInit {
  role: any;  // Objeto para almacenar los detalles del rol

  constructor(
    private route: ActivatedRoute,
    // private roleService: RoleService  // Cambia a RoleService si tienes el servicio de roles
  ) {}

  ngOnInit(): void {
    const roleId = this.route.snapshot.paramMap.get('id');  // Obtener el id del rol desde la URL
    if (roleId) {
      this.fetchRoleDetails(Number(roleId));  // Llama a la función para obtener los detalles del rol
    }
  }

  fetchRoleDetails(id: number): void {
    /*
    this.roleService.getRoleById(id).subscribe(
      (data) => {
        this.role = data.result[0];  // Asigna los detalles del rol
      },
      (error) => {
        console.error('Error al obtener detalles del rol:', error);
      }
    );
    */
  }
}
