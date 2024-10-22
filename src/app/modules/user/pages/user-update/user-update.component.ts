import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/api/user.service';
import { RoleService } from '../../../../core/services/api/role.service';
import { User } from '../../../../core/models/user.model';
import { Role } from '../../../../core/models/role.model';
import Swal from 'sweetalert2';  // Importa SweetAlert2

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-update.component.html',
})
export class UserUpdateComponent implements OnInit {
  username: string = '';  // Nombre de usuario ingresado
  full_name: string = ''; // Nombre completo ingresado
  email: string = '';  // Email ingresado
  phone_number: string = '';  // Número de teléfono ingresado
  id_role: number = 1;  // Rol predeterminado
  roles: Role[] = [];  // Lista de roles obtenidos
  userId: number = 0;  // ID del usuario a editar (inicializado en 0)
  phoneErrorMessage: string = ''; // Mensaje de error para el número de teléfono

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute  // Para obtener el ID desde la URL
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde la URL
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchUserById();  // Cargar los detalles del usuario
    this.fetchRoles();  // Cargar los roles disponibles
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

  // Método para obtener los detalles del usuario por ID
  fetchUserById(): void {
    this.userService.getUserById(this.userId).subscribe(
      (response) => {
        const user = response.result;
        this.username = user.username;
        this.full_name = user.full_name; // Asigna el full_name
        this.email = user.email;
        this.phone_number = user.phone_number; // Asigna el número de teléfono
        this.id_role = user.id_role;
      },
      (error) => {
        console.error('Error al obtener los detalles del usuario:', error);
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

  // Método para actualizar el usuario
  updateUser(): void {
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

    const updatedUser: Partial<User> = {
      username: this.username,
      full_name: this.full_name, // Añadir full_name al objeto
      email: this.email,
      phone_number: this.phone_number, // Añadir phone_number al objeto
      id_role: this.id_role,
    };

    this.userService.updateUser(this.userId, updatedUser as User).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Usuario actualizado exitosamente!',
          showConfirmButton: false,
          timer: 1500 // Mostrar el mensaje brevemente
        }).then(() => {
          this.router.navigate(['/users']);  // Redirige a la lista de usuarios después de la notificación
        });
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al actualizar el usuario',
          text: 'Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  // Método para cancelar la edición y volver a la lista de usuarios
  cancel(): void {
    this.router.navigate(['/users']);
  }
}
