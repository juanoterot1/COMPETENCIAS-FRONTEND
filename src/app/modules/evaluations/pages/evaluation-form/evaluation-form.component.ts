import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../core/services/api/question.service';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { Question } from '../../../../core/models/question.models';
import { EvaluationAnswer } from '../../../../core/models/evaluation_answer.models';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { HttpErrorResponse } from '@angular/common/http';

import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  templateUrl: './evaluation-form.component.html',
  imports: [CommonModule, FormsModule],
})
export class EvaluationFormComponent implements OnInit {
  questions: Question[] = [];
  form: any = {};
  idEvaluation!: number;
  isSaving: boolean = false; // Nueva propiedad para controlar el estado de guardado

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.idEvaluation = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe(
      (response) => {
        this.questions = response.result;
        this.initializeForm();
      },
      (error) => {
        Swal.fire('Error', 'No se pudieron cargar las preguntas.', 'error');
      }
    );
  }

  initializeForm(): void {
    this.questions.forEach((question) => {
      this.form[`question_${question.id}`] = null;
    });
  }

  submitForm(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez guardes las respuestas, no podrás editar esta evaluación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar respuestas',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveAnswers();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Tus respuestas no se han guardado.', 'error');
      }
    });
  }

  saveAnswers(): void {
    this.isSaving = true; // Comienza el proceso de guardado
    const answers = this.questions.map((question) => ({
      id_evaluation: this.idEvaluation,
      id_question: question.id,
      answer: this.form[`question_${question.id}`] ? 'Sí' : 'No',
    })) as EvaluationAnswer[];

    const saveAnswerObservables = answers.map((answer) =>
      this.answerService.createAnwser(answer)
    );

    forkJoin(saveAnswerObservables).subscribe(
      () => {
        this.updateEvaluationStatus();
      },
      (error: HttpErrorResponse) => {
        console.error('Error al guardar las respuestas:', error);
        this.isSaving = false; // Finaliza el proceso de guardado en caso de error
        Swal.fire('Error', 'No se pudieron guardar las respuestas.', 'error');
      }
    );
  }

  private updateEvaluationStatus(): void {
    this.evaluationService.updateEvaluation(this.idEvaluation, { status: 'con respuesta' }).subscribe(
      (response) => {
        console.log('Respuesta al actualizar estado:', response);
        this.isSaving = false; // Finaliza el proceso de guardado
        Swal.fire('Guardado', 'Las respuestas han sido guardadas con éxito.', 'success').then(() => {
          this.router.navigate(['/evaluations']); // Navega al listado de evaluaciones
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error al actualizar el estado de la evaluación:', error);
        this.isSaving = false; // Finaliza el proceso de guardado en caso de error
        Swal.fire('Error', 'No se pudo actualizar el estado de la evaluación.', 'error');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/evaluations']); // Navega al listado de evaluaciones al cancelar
  }
}
