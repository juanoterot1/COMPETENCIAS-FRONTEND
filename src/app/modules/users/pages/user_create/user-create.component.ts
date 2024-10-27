import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/api/user.service';
import { User } from '../../../../core/models/user.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent implements OnInit {
  newUser: Partial<User> = {
    username: '',
    password: '',
    full_name: '',
    phone: '',
    mail: '',
    role_id: undefined,
    dni: ''
  };
  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' },
    { id: 3, name: 'Manager' },
  ];
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createUser(): void {
    if (!this.newUser.username || !this.newUser.password || !this.newUser.full_name || !this.newUser.mail || !this.newUser.role_id || !this.newUser.dni) {
      this.errorMessage = 'Todos los campos obligatorios deben estar completos';
      return;
    }
    this.isSubmitting = true;
    this.userService.createUser(this.newUser, 'currentUser') // 'currentUser' es un valor temporal, reemplazar con el id del usuario que realiza la acción
      .subscribe({
        next: (response: ApiResponse<User>) => {
          this.successMessage = 'Usuario creado exitosamente';
          setTimeout(() => {
            this.router.navigate(['/users']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = 'Ocurrió un error al crear el usuario';
          this.isSubmitting = false;
        }
      });
  }

  cancelCreation(): void {
    this.router.navigate(['/users']);
  }
}
