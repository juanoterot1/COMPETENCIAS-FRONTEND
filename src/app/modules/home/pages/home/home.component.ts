import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HomeService } from '../../../../core/services/api/home.service'; // Asegúrate de que la ruta sea correcta
import { AuthService } from '../../../../core/services/api/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {
  totalEvaluations!: string;
  sinRespuestaCount!: number;
  conRespuestaCount!: number;

  constructor(
    private homeService: HomeService,
    private authService: AuthService, // Servicio de autenticación para gestionar el logout
    private router: Router // Router para la redirección
  ) {}

  ngOnInit(): void {
    this.loadTotalEvaluations();
    this.loadEvaluationsCountByStatus();
  }

  loadTotalEvaluations(): void {
    this.homeService.getTotalEvaluations().subscribe(
      (response) => {
        this.totalEvaluations = response;
      },
      (error) => {
        console.error('Error al cargar el número total de evaluaciones:', error);
      }
    );
  }

  loadEvaluationsCountByStatus(): void {
    this.homeService.getEvaluationsCountByStatus().subscribe(
      (response) => {
        this.sinRespuestaCount = response['sin respuesta'] || 0;
        this.conRespuestaCount = response['con respuesta'] || 0;
      },
      (error) => {
        console.error('Error al cargar los conteos por estado:', error);
      }
    );
  }

  onLogout(): void {
    this.authService.logout(); // Elimina el token de autenticación
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
