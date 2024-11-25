import { Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/api/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
  
  onLogout(): void {
    this.authService.logout(); // Elimina el token de autenticación
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

}