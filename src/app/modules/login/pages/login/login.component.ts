import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/api/auth.service';  // Ajusta la ruta según tu estructura de proyecto
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingrese su nombre de usuario y contraseña.';
      return;
    }
  
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('Respuesta de login:', response); // LOG para verificar la respuesta de login
        if (response && response.access_token) {
          // Si el backend retorna un objeto con "access_token"
          this.authService.setAccessToken(response.access_token);
          console.log('Token almacenado:', this.authService.getAccessToken()); // LOG para verificar el token almacenado
  
          // Agregar un pequeño delay antes de redirigir
          setTimeout(() => {
            this.router.navigate(['/home']);  // Intentar redirigir después del delay
          }, 100); // 100 ms de delay
        } else {
          this.errorMessage = 'Credenciales inválidas. Por favor, intente de nuevo.';
        }
      },
      (error) => {
        this.errorMessage = 'Error al iniciar sesión. Por favor, verifique sus credenciales o inténtelo de nuevo más tarde.';
      }
    );
  }
  
  
}
