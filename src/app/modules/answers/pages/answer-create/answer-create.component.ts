// src/app/modules/answers/pages/answer-create/answer-create.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { Answer } from '../../../../core/models/answer.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-answer-create',
  templateUrl: './answer-create.component.html',
})
export class AnswerCreateComponent {
  answers: Partial<Answer>[] = [
    {
      answer_description: '',
      id_evaluation: 0,
      id_question: 0,
      score: 0,
    },
  ];
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private answerService: AnswerService,
    private router: Router
  ) {}

  addAnswer(): void {
    this.answers.push({
      answer_description: '',
      id_evaluation: 0,
      id_question: 0,
      score: 0,
    });
  }

  removeAnswer(index: number): void {
    this.answers.splice(index, 1);
  }

  createAnswers(): void {
    this.isSubmitting = true;

    // Asignar el ID de usuario (ajusta este valor según corresponda en tu aplicación)
    const idUser = 1;

    // Incluir 'id_user' en cada respuesta antes de enviar
    const answersWithUser = this.answers.map(answer => ({
      ...answer,
      id_user: idUser
    }));

    this.answerService.createAnswers(answersWithUser)
      .subscribe({
        next: (response: ApiResponse<Answer[]>) => {
          this.successMessage = 'Respuestas creadas exitosamente.';
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/answers']), 2000); // Redirige después de 2 segundos
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating answers:', error);
          this.errorMessage = 'Ocurrió un error al crear las respuestas.';
          this.isSubmitting = false;
        },
      });
  }

  cancelCreate(): void {
    this.router.navigate(['/answers']);
  }
}
