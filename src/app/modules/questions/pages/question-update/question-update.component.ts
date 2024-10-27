// src/app/modules/questions/pages/question-update/question-update.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../../core/services/api/question.service';
import { Question } from '../../../../core/models/question.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-question-update',
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  questionId: number = 0;
  question: Partial<Question> = {
    name: '',
    value: 0,
  };
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchQuestionById();
  }

  fetchQuestionById(): void {
    this.questionService.getQuestionById(this.questionId).subscribe(
      (response: ApiResponse<Question>) => {
        this.question = response.result;
      },
      (error) => {
        console.error('Error al obtener los detalles de la pregunta:', error);
        this.errorMessage = 'No se pudo cargar la información de la pregunta.';
      }
    );
  }

  updateQuestion(): void {
    if (!this.question.name || this.question.value === null) {
      this.errorMessage = 'El nombre y el valor de la pregunta son obligatorios';
      return;
    }

    this.isSubmitting = true;
    this.questionService.updateQuestion(this.questionId, this.question, 1) // '1' es un ID de usuario temporal; reemplázalo según sea necesario
      .subscribe({
        next: () => {
          this.successMessage = 'Pregunta actualizada exitosamente';
          setTimeout(() => {
            this.router.navigate(['/questions']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar la pregunta:', error);
          this.errorMessage = 'Ocurrió un error al actualizar la pregunta';
          this.isSubmitting = false;
        }
      });
  }

  cancelUpdate(): void {
    this.router.navigate(['/questions']);
  }
}
