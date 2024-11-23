import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../../../core/services/api/feedback.service';
import { Feedback } from '../../../../core/models/feedback.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-list.component.html',
})
export class FeedbackListComponent implements OnInit {
  feedbacks: Feedback[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  isLoading: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';
  newFeedback: Partial<Feedback> = {
    id_evaluation: undefined,
    feedback_text: '',
  };

  evaluations: { id: number; name: string }[] = [
    { id: 1, name: 'Evaluación 1' },
    { id: 2, name: 'Evaluación 2' },
  ];

  isSubmitting: boolean = false;

  constructor(private feedbackService: FeedbackService, private router: Router) {}

  ngOnInit(): void {
    this.fetchFeedbacks();
  }

  fetchFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService
      .getFeedbacks(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: ApiResponse<Feedback[]>) => {
          this.feedbacks = response.result;
          this.totalItems = response.total || 0;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching feedbacks:', error);
          this.errorMessage = 'Ocurrió un error al cargar la lista de retroalimentaciones.';
          this.isLoading = false;
        },
      });
  }

  createFeedback(): void {
    if (!this.newFeedback.id_evaluation || !this.newFeedback.feedback_text) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    this.isSubmitting = true;
    const feedbackData: Partial<Feedback> = {
      ...this.newFeedback,
      id_user: 1, // Usuario quemado para pruebas
    };

    this.feedbackService.createFeedback(feedbackData, 'user1').subscribe({
      next: (response: ApiResponse<Feedback>) => {
        this.successMessage = 'Retroalimentación creada exitosamente.';
        this.newFeedback = { id_evaluation: undefined, feedback_text: '' }; // Reinicia el formulario
        this.fetchFeedbacks();
        this.isSubmitting = false;
      },
      error: (error: any) => {
        console.error('Error al crear retroalimentación:', error);
        this.errorMessage = 'Ocurrió un error al crear la retroalimentación.';
        this.isSubmitting = false;
      },
    });
  }

  deleteFeedback(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este feedback?')) {
      this.feedbackService.deleteFeedback(id).subscribe({
        next: () => {
          this.successMessage = 'Retroalimentación eliminada exitosamente.';
          this.fetchFeedbacks();
        },
        error: (error: any) => {
          console.error('Error deleting feedback:', error);
          this.errorMessage = 'Ocurrió un error al eliminar el feedback.';
        },
      });
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.fetchFeedbacks();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchFeedbacks();
    }
  }
}
