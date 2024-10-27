import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { Evaluation } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
})
export class EvaluationListComponent implements OnInit {
  evaluations: Evaluation[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  nameFilter: string = '';
  descriptionFilter: string = '';
  showFilters: boolean = false;

  constructor(private evaluationService: EvaluationService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvaluations();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.nameFilter = '';
    this.descriptionFilter = '';
    this.currentPage = 1;
    this.fetchEvaluations();
  }

  fetchEvaluations(): void {
    this.evaluationService.getEvaluations(this.currentPage, this.itemsPerPage, this.nameFilter, this.descriptionFilter).subscribe({
      next: (response) => {
        console.log('Response:', response); // Verificar la respuesta para entender la estructura
        this.evaluations = response.result;

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
        console.error('Error fetching evaluations:', error);
      },
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchEvaluations();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchEvaluations();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchEvaluations();
    }
  }

  createEvaluation(): void {
    this.router.navigate(['/evaluations/create']);
  }

  viewEvaluation(id: number): void {
    this.router.navigate(['/evaluations/view', id]);
  }

  editEvaluation(id: number): void {
    this.router.navigate(['/evaluations/update', id]);
  }

  deleteEvaluation(id: number): void {
    this.evaluationService.deleteEvaluation(id).subscribe(() => {
      this.fetchEvaluations();
    });
  }
}
