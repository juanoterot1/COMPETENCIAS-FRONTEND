import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoadingBarComponent } from './shared/components/loading-bar.component';
import { AuthService } from './core/services/api/auth.service'; // Asegúrate de importar AuthService correctamente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent, HeaderComponent, LoadingBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidebarVisible = true;
  isAuthenticated = false;  // Nueva propiedad para controlar la autenticación

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Verifica autenticación en cada cambio de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAuthenticated = this.authService.isAuthenticated();
        this.sidebarVisible = this.isAuthenticated;
      }
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
