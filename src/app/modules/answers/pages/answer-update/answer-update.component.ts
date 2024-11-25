// src/app/modules/answers/pages/answer-update/answer-update.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { Answer } from '../../../../core/models/answer.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-answer-update',
  templateUrl: './answer-update.component.html',
})
export class AnswerUpdateComponent implements OnInit {
  answer: Partial<Answer> = {
    answer_description: '',
    id_evaluation: 0,
    id_question: 0,
    score: 0,
  };
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;
  answerId!: number;

  constructor(
    private answerService: AnswerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.answerId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.answerId) {
      this.loadAnswer();
    }
  }

  loadAnswer(): void {
    this.answerService.getAnswerById(this.answerId).subscribe({
      next: (response: ApiResponse<Answer>) => {
        this.answer = response.result;
      },
      error: (error: any) => {
        console.error('Error loading answer:', error);
        this.errorMessage = 'Ocurrió un error al cargar la respuesta.';
      },
    });
  }

  updateAnswer(): void {
    this.isSubmitting = true;
    this.answerService.updateAnswer(this.answerId, this.answer).subscribe({
      next: (response: ApiResponse<Answer>) => {
        this.successMessage = 'Respuesta actualizada exitosamente.';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/answers']), 2000); // Redirige después de 2 segundos
      },
      error: (error: any) => {
        console.error('Error updating answer:', error);
        this.errorMessage = 'Ocurrió un error al actualizar la respuesta.';
        this.isSubmitting = false;
      },
    });
  }

  cancelUpdate(): void {
    this.router.navigate(['/answers']);
  }
}
