import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../../../core/services/api/home.service'; // Asegúrate que la ruta es correcta

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // Eliminado NgChartsModule
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {
  totalEvaluations!: string;
  sinRespuestaCount!: number;
  conRespuestaCount!: number;

  constructor(private homeService: HomeService) {}

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
}
