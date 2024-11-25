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

  /**
   * Agregar una nueva respuesta al formulario.
   */
  addAnswer(): void {
    this.answers.push({
      answer_description: '',
      id_evaluation: 0,
      id_question: 0,
      score: 0,
    });
  }

  /**
   * Eliminar una respuesta específica del formulario.
   * @param index Índice de la respuesta a eliminar.
   */
  removeAnswer(index: number): void {
    this.answers.splice(index, 1);
  }

  /**
   * Enviar todas las respuestas al backend en una sola petición.
   */
  createAnswers(): void {
    // Validar que todos los campos sean válidos.
    if (
      this.answers.some(
        (answer) =>
          !answer.answer_description ||
          (answer.id_evaluation ?? 0) <= 0 ||
          (answer.id_question ?? 0) <= 0
      )
    ) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    const idUser = 1;

    // Agregar el ID de usuario a todas las respuestas.
    const answersWithUser = this.answers.map((answer) => ({
      ...answer,
      id_user: idUser,
      answer_description: answer.answer_description!,
      id_evaluation: answer.id_evaluation!,
      id_question: answer.id_question!,
      score: answer.score ?? 0,
    }));

    this.isSubmitting = true;

    // Enviar respuestas al backend.
    this.answerService.createAnswers(answersWithUser).subscribe({
      next: (response: ApiResponse<Answer[]>) => {
        this.successMessage = 'Respuestas creadas exitosamente.';
        this.isSubmitting = false;

        // Redirigir después de un breve tiempo.
        setTimeout(() => this.router.navigate(['/answers']), 2000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creando respuestas:', error);
        this.errorMessage = 'Ocurrió un error al crear las respuestas.';
        this.isSubmitting = false;
      },
    });
  }

  /**
   * Cancelar la creación y redirigir a otra página.
   */
  cancelCreate(): void {
    this.router.navigate(['/answers']);
  }
}
