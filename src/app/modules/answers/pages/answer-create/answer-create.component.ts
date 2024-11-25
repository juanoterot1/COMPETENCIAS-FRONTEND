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

  // Añadir una respuesta al formulario
  addAnswer(): void {
    this.answers.push({
      answer_description: '',
      id_evaluation: 0,
      id_question: 0,
      score: 0,
    });
  }

  // Eliminar una respuesta del formulario
  removeAnswer(index: number): void {
    this.answers.splice(index, 1);
  }

  // Crear todas las respuestas en formato de lista
  createAllAnswers(): void {
    this.isSubmitting = true;

    // ID del usuario
    const idUser = 1;

    // Validar que todas las respuestas estén completas
    if (
      this.answers.some(
        (answer) =>
          !answer.answer_description ||
          answer.id_evaluation === undefined ||
          answer.id_evaluation <= 0 ||
          answer.id_question === undefined ||
          answer.id_question <= 0
      )
    ) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      this.isSubmitting = false;
      return;
    }
    

    // Mapear las respuestas para incluir el campo `id_user`
    const answersWithUser = this.answers.map((answer) => ({
      answer_description: answer.answer_description,
      id_evaluation: answer.id_evaluation,
      id_question: answer.id_question,
      id_user: idUser,
      score: answer.score || 0, // Valor predeterminado para `score`
    }));

    // Llamar al servicio para enviar las respuestas
    this.answerService.createAnswers(answersWithUser).subscribe({
      next: (response: ApiResponse<Answer[]>) => {
        this.successMessage = 'Todas las respuestas se han creado exitosamente.';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/answers']), 2000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creando respuestas:', error);
        this.errorMessage = 'Ocurrió un error al crear las respuestas.';
        this.isSubmitting = false;
      },
    });
  }

  // Cancelar la creación y volver a la lista
  cancelCreate(): void {
    this.router.navigate(['/answers']);
  }
}
