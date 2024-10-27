import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/api/user.service';
import { User } from '../../../../core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-update.component.html',
})
export class UserUpdateComponent implements OnInit {
  userId: number = 0;
  username: string = '';
  full_name: string = '';
  mail: string = '';
  dni: string = '';
  password: string = ''; // Contraseña (opcional)
  role_id: number | null = null;

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' },
    { id: 3, name: 'Manager' },
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchUserById();
  }

  fetchUserById(): void {
    this.userService.getUserById(this.userId).subscribe(
      (response) => {
        const user = response.result;

        if (user) {
          this.username = user.username || '';
          this.full_name = user.full_name || '';
          this.mail = user.mail || '';
          this.dni = user.dni || '';
          this.password = ''; // Dejar en blanco para mantener seguridad
          this.role_id = user.role_id || null;
        } else {
          console.error('El objeto usuario no existe en la respuesta');
        }
      },
      (error) => {
        console.error('Error al obtener los detalles del usuario:', error);
      }
    );
  }

  updateUser(): void {
    const updatedUser: Partial<User> = {
      username: this.username,
      full_name: this.full_name,
      mail: this.mail,
      dni: this.dni,
      role_id: this.role_id ?? undefined,
    };

    // Añadir contraseña solo si fue cambiada
    if (this.password && this.password.trim() !== '') {
      updatedUser.password = this.password;
    }

    this.userService.updateUser(this.userId, updatedUser as User, 'currentUser').subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Usuario actualizado exitosamente!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.router.navigate(['/users']);
        });
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al actualizar el usuario',
          text: 'Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok',
        });
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
