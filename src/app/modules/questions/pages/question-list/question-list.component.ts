import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../../../core/services/api/question.service';
import { Question } from '../../../../core/models/question.model';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  nameFilter: string = '';
  showFilters: boolean = false;

  constructor(
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchQuestions();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.nameFilter = '';
    this.currentPage = 1;
    this.fetchQuestions();
  }

  fetchQuestions(): void {
    this.questionService.getQuestions(this.currentPage, this.itemsPerPage, this.nameFilter).subscribe({
      next: (response) => {
        console.log('Response:', response); // Verificar la respuesta para entender la estructura
        this.questions = response.result;
  
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
        console.error('Error fetching questions:', error);
      },
    });
  }
  
  

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchQuestions();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchQuestions();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchQuestions();
    }
  }

  createQuestion(): void {
    this.router.navigate(['/questions/create']);
  }

  editQuestion(id: number): void {
    this.router.navigate(['/questions/update', id]);
  }

  deleteQuestion(id: number): void {
    this.questionService.deleteQuestion(id).subscribe(() => {
      this.fetchQuestions();
    });
  }
}
