import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../../../core/services/api/question.service';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import Swal from 'sweetalert2';
import { Evaluation } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-create.component.html',
})
export class QuestionCreateComponent implements OnInit {
  name: string = '';
  value!: number;
  id_evaluation!: number;
  evaluations: Evaluation[] = [];

  constructor(
    private questionService: QuestionService,
    private evaluationService: EvaluationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvaluations();
  }

  loadEvaluations(): void {
    this.evaluationService.getEvaluations().subscribe((response) => {
      this.evaluations = response.result;
    });
  }

  createQuestion(): void {
    if (!this.name.trim() || this.value <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre y el valor son requeridos y deben ser válidos.',
      });
      return;
    }

    const newQuestion = { name: this.name, value: this.value, id_evaluation: this.id_evaluation };

    this.questionService.createQuestion(newQuestion).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `La pregunta ${this.name} ha sido creada exitosamente.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/questions']);
        });
      },
      (error) => {
        console.error('Error al crear la pregunta:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al crear la pregunta',
          text: 'Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/questions']);
  }
}
