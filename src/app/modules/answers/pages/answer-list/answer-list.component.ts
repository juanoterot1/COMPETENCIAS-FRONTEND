// src/app/modules/answers/pages/answer-list/answer-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { Answer } from '../../../../core/models/answer.model';

@Component({
  selector: 'app-answer-list',
  templateUrl: './answer-list.component.html',
})
export class AnswerListComponent implements OnInit {
  answers: Answer[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  idEvaluationFilter?: number;
  showFilters: boolean = false;

  constructor(
    private answerService: AnswerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAnswers();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.idEvaluationFilter = undefined;
    this.currentPage = 1;
    this.fetchAnswers();
  }

  fetchAnswers(): void {
    this.answerService.getAnswers(this.currentPage, this.itemsPerPage, this.idEvaluationFilter).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.answers = response.result;

        // Verificación explícita de la existencia de `totalItems`
        if ('totalItems' in response && typeof response.totalItems === 'number') {
          this.totalItems = response.totalItems;
        } else if ('total' in response && typeof response.total === 'number') {
          this.totalItems = response.total;
        } else {
          this.totalItems = response.result.length;
        }
      },
      error: (error) => {
        console.error('Error fetching answers:', error);
      },
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchAnswers();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchAnswers();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchAnswers();
    }
  }

  createAnswer(): void {
    this.router.navigate(['/answers/create']);
  }

  editAnswer(id: number): void {
    this.router.navigate(['/answers/update', id]);
  }

  deleteAnswer(id: number): void {
    this.answerService.deleteAnswer(id).subscribe(() => {
      this.fetchAnswers();
    });
  }
}
