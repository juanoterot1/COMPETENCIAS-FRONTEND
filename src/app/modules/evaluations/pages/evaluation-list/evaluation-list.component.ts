import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { Evaluation } from '../../../../core/models/evaluation.model';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './evaluation-list.component.html',
})
export class EvaluationListComponent implements OnInit {
  evaluations: Evaluation[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  sortBy: 'id' | 'name' = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private evaluationService: EvaluationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEvaluations();
  }

  fetchEvaluations(): void {
    this.evaluationService.getEvaluations().subscribe(
      (response) => {
        this.evaluations = response.result;
        this.totalItems = this.evaluations.length;
      },
      (error) => {
        console.error('Error fetching evaluations:', error);
      }
    );
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1;
    this.fetchEvaluations();
  }

  toggleSort(field: 'id' | 'name'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
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

  viewEvaluation(evaluationId: number): void {
    this.router.navigate([`/evaluations/update/${evaluationId}`]);
  }

  deleteEvaluation(evaluation: Evaluation): void {
    Swal.fire({
      title: `¿Eliminar la evaluación ${evaluation.name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.evaluationService.deleteEvaluation(evaluation.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Evaluación ${evaluation.name} eliminada.`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.evaluations = this.evaluations.filter((e) => e.id !== evaluation.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar la evaluación',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok',
            });
            console.error('Error al eliminar la evaluación:', error);
          }
        );
      }
    });
  }

  navigateToCreateEvaluation(): void {
    this.router.navigate(['/evaluations/create']);
  }

  exportToExcel(): void {
    const exportData = this.evaluations.map((evaluation) => ({
      ID: evaluation.id,
      Nombre: evaluation.name,
      Materia: evaluation.id_subject,
      Facultad: evaluation.id_faculty,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluaciones');
    XLSX.writeFile(workbook, 'evaluaciones.xlsx');
  }
}
