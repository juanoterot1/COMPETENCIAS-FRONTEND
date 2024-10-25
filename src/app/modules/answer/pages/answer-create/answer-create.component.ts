import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { QuestionService } from '../../../../core/services/api/question.service';
import { UserService } from '../../../../core/services/api/user.service';
import Swal from 'sweetalert2';
import { Evaluation } from '../../../../core/models/evaluation.model';
import { Question } from '../../../../core/models/question.models';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-answer-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './answer-create.component.html',
})
export class AnswerCreateComponent implements OnInit {
  answer_description: string = '';
  id_evaluation!: number;
  id_question!: number;
  id_user!: number;
  score!: number;

  evaluations: Evaluation[] = [];
  questions: Question[] = [];
  users: User[] = [];

  constructor(
    private answerService: AnswerService,
    private evaluationService: EvaluationService,
    private questionService: QuestionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvaluations();
    this.loadQuestions();
    this.loadUsers();
  }

  loadEvaluations(): void {
    this.evaluationService.getEvaluations().subscribe((response) => {
      this.evaluations = response.result;
    });
  }

  loadQuestions(): void {
    this.questionService.getQuestions().subscribe((response) => {
      this.questions = response.result;
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((response) => {
      this.users = response.result;
    });
  }

  createAnswer(): void {
    if (!this.answer_description.trim() || !this.score) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La descripción y la puntuación son requeridos',
      });
      return;
    }

    const newAnswer = {
      answer_description: this.answer_description,
      id_evaluation: this.id_evaluation,
      id_question: this.id_question,
      id_user: this.id_user,
      score: this.score,
    };

    this.answerService.createAnswer(newAnswer).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `La respuesta ha sido creada exitosamente.`,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.router.navigate(['/answers']);
        });
      },
      (error) => {
        console.error('Error al crear la respuesta:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al crear la respuesta',
          text: 'Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok',
        });
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/answers']);
  }
}
