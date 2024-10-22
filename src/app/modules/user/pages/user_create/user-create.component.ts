import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Necesario para *ngFor y otras directivas comunes
import { FormsModule } from '@angular/forms';  // Necesario para [(ngModel)]
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/api/user.service';
import { RoleService } from '../../../../core/services/api/role.service';
import { User } from '../../../../core/models/user.model';
import { Role } from '../../../../core/models/role.model';
import Swal from 'sweetalert2';  // Importa SweetAlert2

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Importa CommonModule y FormsModule
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent implements OnInit {
  username: string = '';  // Nombre de usuario ingresado
  full_name: string = ''; // Nombre completo ingresado
  email: string = '';     // Email ingresado
  phone_number: string = '';  
  id_role: number = 1;    // Rol predeterminado
  roles: Role[] = [];     // Lista de roles obtenidos
  phoneErrorMessage: string = ''; // Mensaje de error para el número de teléfono

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRoles();  // Cargar los roles al iniciar el componente
  }

  // Método para obtener los roles disponibles
  fetchRoles(): void {
    this.roleService.getRoles().subscribe(
      (response) => {
        this.roles = response.result;
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
      }
    );
  }

  // Método para validar el número de teléfono
  validatePhoneNumber(): void {
    if (this.phone_number.length > 10) {
      this.phone_number = this.phone_number.slice(0, 10); // Limitar a 10 dígitos
      this.phoneErrorMessage = 'El número de teléfono no puede tener más de 10 dígitos.';
    } else {
      this.phoneErrorMessage = ''; // Limpiar el mensaje si la longitud es correcta
    }
  }

  // Método para crear un nuevo usuario
  createUser(): void {
    if (this.phone_number.length !== 10) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Número de teléfono inválido',
        text: 'El número de teléfono debe tener exactamente 10 dígitos.',
        confirmButtonText: 'Ok'
      });
      return;
    }

    const newUser: Partial<User> = {
      username: this.username,
      full_name: this.full_name, // Añadido el campo full_name
      email: this.email,
      phone_number: this.phone_number,  // Añadido el campo phone_number
      id_role: this.id_role,
    };

    this.userService.createUser(newUser as User).subscribe(
      () => {
        // SweetAlert centrado
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `¡Evaluador ${this.username} ha sido creado exitosamente!`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/users']);  // Redirige a la lista de usuarios después de la notificación
        });
      },
      (error) => {
        console.error('Error al crear el evaluador:', error);
        // Usar SweetAlert para mostrar un error centrado
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al crear el evaluador',
          text: 'Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  // Método para cancelar la creación del usuario y volver a la lista de usuarios
  cancel(): void {
    this.router.navigate(['/users']);
  }
}
