import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../../core/services/api/question.service';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import Swal from 'sweetalert2';
import { Evaluation } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-question-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  questionId!: number;
  name: string = '';
  value!: number;
  id_evaluation!: number;
  evaluations: Evaluation[] = [];

  constructor(
    private questionService: QuestionService,
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.questionId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchQuestionDetails();
    this.loadEvaluations();
  }

  fetchQuestionDetails(): void {
    this.questionService.getQuestionById(this.questionId).subscribe(
      (response) => {
        const question = response.result;
        if (question) {
          this.name = question.name;
          this.value = question.value;
          this.id_evaluation = question.id_evaluation;
        } else {
          console.error('Pregunta no encontrada');
        }
      },
      (error) => {
        console.error('Error al obtener los detalles de la pregunta:', error);
      }
    );
  }

  loadEvaluations(): void {
    this.evaluationService.getEvaluations().subscribe((response) => {
      this.evaluations = response.result;
    });
  }

  updateQuestion(): void {
    const updatedQuestion = { name: this.name, value: this.value, id_evaluation: this.id_evaluation };

    this.questionService.updateQuestion(this.questionId, updatedQuestion).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Pregunta actualizada exitosamente',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/questions']);
        });
      },
      (error) => {
        Swal.fire('Error', 'Error al actualizar la pregunta', 'error');
        console.error('Error al actualizar la pregunta:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/questions']);
  }
}
