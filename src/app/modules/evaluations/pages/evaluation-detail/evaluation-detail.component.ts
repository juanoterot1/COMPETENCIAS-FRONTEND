import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
// import { EvaluationService } from '../../../../core/services/api/evaluation.service';  // Cambia el servicio según corresponda

@Component({
  selector: 'app-evaluation-detail',  // Cambia el selector a evaluation
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evaluation-detail.component.html',  // Apunta al HTML de evaluación
})
export class EvaluationDetailComponent implements OnInit {
  evaluation: any;  // Cambia de appointment a evaluation

  constructor(
    private route: ActivatedRoute,
    // private evaluationService: EvaluationService  // Cambia a EvaluationService si tienes el servicio de evaluaciones
  ) {}

  ngOnInit(): void {
    const evaluationId = this.route.snapshot.paramMap.get('id');
    if (evaluationId) {
      this.fetchEvaluationDetails(Number(evaluationId));  // Llama a la función para obtener detalles de la evaluación
    }
  }

  fetchEvaluationDetails(id: number): void {
    /*
    this.evaluationService.getEvaluationById(id).subscribe(
      (data) => {
        this.evaluation = data.result[0];  // Asigna la evaluación recibida
      },
      (error) => {
        console.error('Error fetching evaluation details:', error);
      }
    );
    */
  }
}
