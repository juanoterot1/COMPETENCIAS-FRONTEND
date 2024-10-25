import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { QuestionService } from '../../../../core/services/api/question.service';
import { UserService } from '../../../../core/services/api/user.service';
import Swal from 'sweetalert2';
import { Evaluation } from '../../../../core/models/evaluation.model';
import { Question } from '../../../../core/models/question.models';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-answer-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './answer-update.component.html',
})
export class AnswerUpdateComponent implements OnInit {
  answerId!: number;
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.answerId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchAnswerDetails();
    this.loadEvaluations();
    this.loadQuestions();
    this.loadUsers();
  }

  fetchAnswerDetails(): void {
    this.answerService.getAnswerById(this.answerId).subscribe(
      (response) => {
        const answer = response.result;
        if (answer) {
          this.answer_description = answer.answer_description;
          this.id_evaluation = answer.id_evaluation;
          this.id_question = answer.id_question;
          this.id_user = answer.id_user;
          this.score = answer.score;
        } else {
          console.error('Answer not found');
        }
      },
      (error) => {
        console.error('Error al obtener los detalles de la respuesta:', error);
      }
    );
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

  updateAnswer(): void {
    const updatedAnswer = {
      answer_description: this.answer_description,
      id_evaluation: this.id_evaluation,
      id_question: this.id_question,
      id_user: this.id_user,
      score: this.score,
    };

    this.answerService.updateAnswer(this.answerId, updatedAnswer).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Respuesta actualizada exitosamente',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.router.navigate(['/answers']);
        });
      },
      (error) => {
        Swal.fire('Error', 'Error al actualizar la respuesta', 'error');
        console.error('Error al actualizar la respuesta:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/answers']);
  }
}
