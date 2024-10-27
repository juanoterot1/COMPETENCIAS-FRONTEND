// src/app/modules/questions/pages/question-create/question-create.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../../../core/services/api/question.service';
import { Question } from '../../../../core/models/question.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
})
export class QuestionCreateComponent implements OnInit {
  newQuestion: Partial<Question> = {
    name: '',
    value: 0,
    id_evaluation: 1, // Valor temporal; ajusta según la evaluación correspondiente
  };
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createQuestion(): void {
    if (!this.newQuestion.name || this.newQuestion.value === null) {
      this.errorMessage = 'Todos los campos obligatorios deben estar completos';
      return;
    }

    this.isSubmitting = true;
    this.questionService.createQuestion(this.newQuestion, 1) // '1' es un valor temporal para idUser; reemplázalo según sea necesario
      .subscribe({
        next: (response: ApiResponse<Question>) => {
          this.successMessage = 'Pregunta creada exitosamente';
          setTimeout(() => {
            this.router.navigate(['/questions']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al crear la pregunta:', error);
          this.errorMessage = 'Ocurrió un error al crear la pregunta';
          this.isSubmitting = false;
        }
      });
  }

  cancelCreation(): void {
    this.router.navigate(['/questions']);
  }
}
