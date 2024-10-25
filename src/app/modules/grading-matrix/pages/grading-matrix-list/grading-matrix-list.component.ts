import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GradingMatrixService } from '../../../../core/services/api/grading-matrix.service';
import { GradingMatrix } from '../../../../core/models/grading-matrix.model';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grading-matrix-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './grading-matrix-list.component.html',
})
export class GradingMatrixListComponent implements OnInit {
  gradingMatrices: GradingMatrix[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  sortBy: 'id' | 'id_subject' = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private gradingMatrixService: GradingMatrixService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchGradingMatrices();
  }

  fetchGradingMatrices(): void {
    this.gradingMatrixService.getGradingMatrices().subscribe(
      (response) => {
        this.gradingMatrices = response.result;
        this.totalItems = this.gradingMatrices.length;
      },
      (error) => {
        console.error('Error fetching grading matrices:', error);
      }
    );
  }

  navigateToCreateGradingMatrix(): void {
    this.router.navigate(['/grading-matrix/create']);
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1;
    this.fetchGradingMatrices();
  }

  toggleSort(field: 'id' | 'id_subject'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.fetchGradingMatrices();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchGradingMatrices();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchGradingMatrices();
    }
  }

  viewGradingMatrix(id: number): void {
    this.router.navigate([`/grading-matrix/update/${id}`]);
  }

  deleteGradingMatrix(matrix: GradingMatrix): void {
    Swal.fire({
      title: `¿Eliminar la Grading Matrix con ID ${matrix.id}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gradingMatrixService.deleteGradingMatrix(matrix.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Grading Matrix eliminada.`,
              showConfirmButton: false,
              timer: 1500
            });
            this.gradingMatrices = this.gradingMatrices.filter(m => m.id !== matrix.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar la Grading Matrix',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok'
            });
            console.error('Error al eliminar la Grading Matrix:', error);
          }
        );
      }
    });
  }

  exportToExcel(): void {
    const exportData = this.gradingMatrices.map(matrix => ({
      ID: matrix.id,
      'ID Subject': matrix.id_subject,
      'Total Evaluations': matrix.total_evaluations,
      'Total Score': matrix.total_score,
      Recommendation: matrix.recommendation
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grading Matrices');
    XLSX.writeFile(workbook, 'grading_matrices.xlsx');
  }
}
