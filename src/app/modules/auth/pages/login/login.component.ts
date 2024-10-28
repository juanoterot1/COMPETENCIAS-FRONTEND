import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/api/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['/dashboard']);  // Redirige al dashboard tras el login exitoso
        this.errorMessage = '';  // Limpia el mensaje de error en caso de éxito
      },
      error => {
        this.errorMessage = error.message;  // Asigna el mensaje de error para mostrar en la página
      }
    );
  }
}
