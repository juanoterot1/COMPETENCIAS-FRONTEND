import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../../../core/services/api/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {
  totalEvaluations!: number;
  totalSubjects!: number; // Nueva propiedad para el conteo de asignaturas
  sinRespuestaCount: number = 0; // Valor predeterminado
  conRespuestaCount: number = 0; // Valor predeterminado

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadTotalEvaluations();
    this.loadTotalSubjects();
  }

  // Método para cargar el total de evaluaciones
  loadTotalEvaluations(): void {
    this.homeService.getTotalEvaluations().subscribe(
      (response) => {
        this.totalEvaluations = response;
        console.log('Total de evaluaciones:', this.totalEvaluations);
      },
      (error) => {
        console.error('Error al cargar el número total de evaluaciones:', error);
      }
    );
  }

  // Método para cargar el total de asignaturas
  loadTotalSubjects(): void {
    this.homeService.getTotalSubjects().subscribe(
      (response) => {
        this.totalSubjects = response;
        console.log('Total de asignaturas:', this.totalSubjects);
      },
      (error) => {
        console.error('Error al cargar el número total de asignaturas:', error);
      }
    );
  }
}
