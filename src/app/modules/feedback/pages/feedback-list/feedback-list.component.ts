import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FeedbackService } from '../../../../core/services/api/feedback.service';
import { Feedback } from '../../../../core/models/feedback.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './feedback-list.component.html',
})
export class FeedbackListComponent implements OnInit {
  feedbacks: Feedback[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  idEvaluationFilter?: number;
  idUserFilter?: number;

  showFilters: boolean = false;
  showDialog: boolean = false;
  dialogTitle: string = '';
  dialogMessage: string = '';
  selectedFeedbackId?: number;

  sortBy: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFeedbacks();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.idEvaluationFilter = undefined;
    this.idUserFilter = undefined;
    this.currentPage = 1;
    this.fetchFeedbacks();
  }

  fetchFeedbacks(): void {
    this.feedbackService
      .getFeedbacks(
        this.currentPage,
        this.itemsPerPage,
        this.idEvaluationFilter,
        this.idUserFilter
      )
      .subscribe({
        next: (response: ApiResponse<Feedback[]>) => {
          this.feedbacks = response.result;
          this.totalItems = response.total || 0;
        },
        error: (error: any) => {
          console.error('Error fetching feedbacks:', error);
        },
      });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchFeedbacks();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchFeedbacks();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchFeedbacks();
    }
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1;
    this.fetchFeedbacks();
  }

  toggleSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.fetchFeedbacks();
  }

  deleteFeedback(id: number): void {
    this.dialogTitle = 'Confirmar Eliminación';
    this.dialogMessage = '¿Estás seguro de que deseas eliminar esta retroalimentación? Esta acción no se puede deshacer.';
    this.selectedFeedbackId = id;
    this.showDialog = true;
  }

  onConfirmDialog(): void {
    if (this.selectedFeedbackId !== undefined) {
      this.feedbackService.deleteFeedback(this.selectedFeedbackId).subscribe(() => {
        this.fetchFeedbacks();
      });
    }
    this.showDialog = false;
  }

  onCancelDialog(): void {
    this.showDialog = false;
  }

  navigateToCreateFeedback(): void {
    this.router.navigate(['/feedback/create']);
  }
}
