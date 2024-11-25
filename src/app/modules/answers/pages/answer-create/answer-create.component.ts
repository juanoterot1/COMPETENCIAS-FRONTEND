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
  /**
   * Array de respuestas que se enviarán al backend.
   */
  answers: Partial<Answer>[] = [
    {
      answer_description: '',
      id_evaluation: 0,
      id_question: 0,
      score: 0,
    },
  ];

  // Mensajes de estado
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private answerService: AnswerService,
    private router: Router
  ) {}

  /**
   * Agregar una nueva respuesta al listado.
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
   * Eliminar una respuesta específica del listado.
   * @param index Índice de la respuesta a eliminar.
   */
  removeAnswer(index: number): void {
    this.answers.splice(index, 1);
  }

  /**
   * Crear múltiples respuestas en batch.
   */
  createAnswers(): void {
    // Validar que las respuestas tengan datos completos
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

    // Asignar el ID de usuario (ajusta según tu aplicación)
    const idUser = 1;

    // Mapear las respuestas para incluir 'id_user'
    const answersWithUser = this.answers.map((answer) => ({
      ...answer,
      id_user: idUser,
      answer_description: answer.answer_description!,
      id_evaluation: answer.id_evaluation!,
      id_question: answer.id_question!,
      score: answer.score ?? 0,
    }));

    this.isSubmitting = true;

    // Llamar al servicio para enviar las respuestas
    this.answerService.createAnswers(answersWithUser).subscribe({
      next: (response: ApiResponse<Answer[]>) => {
        this.successMessage = 'Respuestas creadas exitosamente.';
        this.isSubmitting = false;

        // Redirigir después de 2 segundos
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
   * Cancelar la creación y redirigir.
   */
  cancelCreate(): void {
    this.router.navigate(['/answers']);
  }
}
