import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
// import { UserService } from '../../../../core/services/api/user.service';  // Cambia a UserService si tienes el servicio de usuarios

@Component({
  selector: 'app-user-detail',  // Cambié el selector a user
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.component.html',  // Apunta al HTML de usuario
})
export class UserDetailComponent implements OnInit {
  user: any;  // Cambié de evaluation a user

  constructor(
    private route: ActivatedRoute,
    // private userService: UserService  // Cambia a UserService si tienes el servicio de usuarios
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');  // Obtén el id del usuario de la URL
    if (userId) {
      this.fetchUserDetails(Number(userId));  // Llama a la función para obtener detalles del usuario
    }
  }

  fetchUserDetails(id: number): void {
    /*
    this.userService.getUserById(id).subscribe(
      (data) => {
        this.user = data.result[0];  // Asigna los detalles del usuario recibidos
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
    */
  }
}
