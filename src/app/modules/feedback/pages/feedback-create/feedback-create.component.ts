// src/app/modules/feedback/pages/feedback-create/feedback-create.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from '../../../../core/services/api/feedback.service';
import { Feedback } from '../../../../core/models/feedback.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { Evaluation } from '../../../../core/models/evaluation.model';
import { UserService } from '../../../../core/services/api/user.service';
import { User } from '../../../../core/models/user.model'; // Modelo de usuario
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-create',
  templateUrl: './feedback-create.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FeedbackCreateComponent implements OnInit {
  newFeedback: Partial<Feedback> = {
    id_evaluation: undefined,
    feedback_text: '',
    id_user: undefined, // Selección del usuario
  };
  evaluations: Evaluation[] = [];
  users: User[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private evaluationService: EvaluationService,
    private userService: UserService, // Servicio de usuarios
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEvaluations();
    this.fetchUsers();
  }

  fetchEvaluations(): void {
    this.evaluationService.getEvaluations(1, 1000).subscribe({
      next: (response: ApiResponse<Evaluation[]>) => {
        this.evaluations = response.result;
      },
      error: (error: any) => {
        console.error('Error al obtener las evaluaciones:', error);
        this.errorMessage = 'Ocurrió un error al cargar las evaluaciones.';
      },
    });
  }

  fetchUsers(): void {
    this.userService.getUsers(1, 1000).subscribe({
      next: (response: ApiResponse<User[]>) => {
        this.users = response.result;
      },
      error: (error: any) => {
        console.error('Error al obtener los usuarios:', error);
        this.errorMessage = 'Ocurrió un error al cargar los usuarios.';
      },
    });
  }

  createFeedback(): void {
    if (!this.newFeedback.id_evaluation || !this.newFeedback.feedback_text || !this.newFeedback.id_user) {
      this.errorMessage = 'Todos los campos obligatorios deben estar completos.';
      return;
    }

    this.isSubmitting = true;

    const feedbackData: Partial<Feedback> = {
      ...this.newFeedback,
    };

    this.feedbackService.createFeedback(feedbackData, '1').subscribe({
      next: (response: ApiResponse<Feedback>) => {
        this.successMessage = 'Retroalimentación creada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/feedback']);
        }, 1500);
      },
      error: (error: any) => {
        console.error('Error al crear la retroalimentación:', error);
        this.errorMessage = 'Ocurrió un error al crear la retroalimentación.';
        this.isSubmitting = false;
      },
    });
  }

  cancelCreation(): void {
    this.router.navigate(['/feedback']);
  }
}
