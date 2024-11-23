// src/app/modules/feedback/pages/feedback-create/feedback-create.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedbackService } from '../../../../core/services/api/feedback.service';
import { Feedback } from '../../../../core/models/feedback.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { Evaluation } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-feedback-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-create.component.html',
})
export class FeedbackCreateComponent implements OnInit {
  newFeedback: Partial<Feedback> = {
    id_evaluation: undefined,
    feedback_text: '',
  };
  evaluations: Evaluation[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private evaluationService: EvaluationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEvaluations();
  }

  fetchEvaluations(): void {
    this.evaluationService.getEvaluations(1, 1000).subscribe({
      next: (response: ApiResponse<Evaluation[]>) => {
        this.evaluations = response.result;
      },
      error: (error: any) => {
        console.error('Error al obtener las evaluaciones:', error);
        this.errorMessage = 'Ocurrió un error al cargar las evaluaciones';
      },
    });
  }

  createFeedback(): void {
    if (!this.newFeedback.id_evaluation || !this.newFeedback.feedback_text) {
      this.errorMessage = 'Todos los campos obligatorios deben estar completos';
      return;
    }

    this.isSubmitting = true;

    const performedBy = 'currentUser'; // Hardcodeamos el valor
    const feedbackData: Partial<Feedback> = {
      ...this.newFeedback,
      id_user: 1, // Hardcodeamos el id_user como 1
    };

    this.feedbackService.createFeedback(feedbackData, performedBy).subscribe({
      next: (response: ApiResponse<Feedback>) => {
        this.successMessage = 'Retroalimentación creada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/feedback']);
        }, 2000);
      },
      error: (error: any) => {
        console.error('Error al crear la retroalimentación:', error);
        this.errorMessage = 'Ocurrió un error al crear la retroalimentación';
        this.isSubmitting = false;
      },
    });
  }

  cancelCreation(): void {
    this.router.navigate(['/feedback']);
  }
}
