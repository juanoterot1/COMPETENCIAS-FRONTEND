// src/app/modules/answers/pages/answer-create/answer-create.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { Answer } from '../../../../core/models/answer.model';

@Component({
  selector: 'app-answer-create',
  templateUrl: './answer-create.component.html',
})
export class AnswerCreateComponent {
  answer: Partial<Answer> = {
    answer_description: '',
    id_evaluation: 0,
    id_question: 0,
    score: 0,
  };
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private answerService: AnswerService,
    private router: Router
  ) {}

  createAnswer(): void {
    this.isSubmitting = true;
    this.answerService.createAnswer(this.answer, 1) // Aquí el ID de usuario es 1 por ejemplo, ajusta según tu caso
      .subscribe({
        next: (response) => {
          this.successMessage = 'Respuesta creada exitosamente.';
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/answers']), 2000); // Redirige después de 2 segundos
        },
        error: (error) => {
          console.error('Error creating answer:', error);
          this.errorMessage = 'Ocurrió un error al crear la respuesta.';
          this.isSubmitting = false;
        },
      });
  }

  cancelCreate(): void {
    this.router.navigate(['/answers']);
  }
}
