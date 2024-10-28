// src/app/modules/questions/pages/question-create/question-create.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../../../core/services/api/question.service';
import { EvaluationService } from '../../../../core/services/api/evaluation.service'; // Importa EvaluationService
import { Question } from '../../../../core/models/question.model';
import { Evaluation } from '../../../../core/models/evaluation.model'; // Importa Evaluation model
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
})
export class QuestionCreateComponent implements OnInit {
  newQuestion: Partial<Question> = {
    name: '',
    value: 0,
    id_evaluation: undefined, // Ahora será undefined hasta que se seleccione
  };
  evaluations: Evaluation[] = []; // Lista de evaluaciones
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private questionService: QuestionService,
    private evaluationService: EvaluationService, // Inyecta EvaluationService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvaluations(); // Carga las evaluaciones al iniciar el componente
  }

  loadEvaluations(): void {
    this.evaluationService.getEvaluations(1, 100).subscribe({
      next: (response: ApiResponse<Evaluation[]>) => {
        this.evaluations = response.result;
      },
      error: (error) => {
        console.error('Error al cargar las evaluaciones:', error);
        this.errorMessage = 'Ocurrió un error al cargar las evaluaciones.';
      }
    });
  }

  createQuestion(): void {
    if (!this.newQuestion.name || this.newQuestion.value === null || !this.newQuestion.id_evaluation) {
      this.errorMessage = 'Todos los campos obligatorios deben estar completos';
      return;
    }

    this.isSubmitting = true;
    this.questionService.createQuestion(this.newQuestion, 1)
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
