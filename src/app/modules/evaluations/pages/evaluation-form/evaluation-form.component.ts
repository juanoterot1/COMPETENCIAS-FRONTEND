// src/app/modules/evaluations/pages/evaluation-form/evaluation-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { QuestionService } from '../../../../core/services/api/question.service';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { Evaluation } from '../../../../core/models/evaluation.model';
import { Question } from '../../../../core/models/question.model';
import { Answer } from '../../../../core/models/answer.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
})
export class EvaluationFormComponent implements OnInit {
  evaluationId!: number;
  evaluation!: Evaluation;
  questions: Question[] = [];
  selectedAnswers: { [key: number]: string } = {}; // Respuestas seleccionadas por pregunta

  constructor(
    private route: ActivatedRoute,
    private evaluationService: EvaluationService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.evaluationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEvaluation();
    this.loadQuestions();
  }

  loadEvaluation(): void {
    this.evaluationService.getEvaluationById(this.evaluationId).subscribe({
      next: (response) => {
        this.evaluation = response.result;
      },
      error: (error) => {
        console.error('Error loading evaluation:', error);
        Swal.fire('Error', 'No se pudo cargar la evaluación.', 'error');
      },
    });
  }

  loadQuestions(): void {
    this.questionService.getQuestions(1, 100).subscribe({
      next: (response) => {
        this.questions = response.result.filter((q) => q.id_evaluation === this.evaluationId);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      },
    });
  }

  submitForm(): void {
    const answersToSave = this.questions.map((question) => ({
      answer_description: this.selectedAnswers[question.id],
      id_evaluation: this.evaluationId,
      id_question: question.id,
      score: 0,
    }));

    // Enviar todas las respuestas en una sola petición
    this.answerService.createAnswers(answersToSave).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Evaluación completada!',
          html: 'Tu evaluación ha sido guardada correctamente.<br><strong>En breve podrás visualizar la retroalimentación de la inteligencia artificial.</strong>',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['/evaluations']);
        });
      },
      error: (error) => {
        console.error('Error al guardar las respuestas:', error);
        Swal.fire('Error', 'Hubo un error al guardar las respuestas.', 'error');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/evaluations']);
  }
}
