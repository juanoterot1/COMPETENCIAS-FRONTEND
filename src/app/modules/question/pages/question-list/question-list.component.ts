import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { QuestionService } from '../../../../core/services/api/question.service';
import { Question } from '../../../../core/models/question.models';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Asegúrate de importar FormsModule aquí
  templateUrl: './question-list.component.html',
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(private questionService: QuestionService, private router: Router) {}

  ngOnInit(): void {
    this.fetchQuestions();
  }

  fetchQuestions(): void {
    this.questionService.getQuestions().subscribe(
      (response) => {
        this.questions = response.result;
        this.totalItems = this.questions.length;
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
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

  deleteQuestion(question: Question): void {
    Swal.fire({
      title: `¿Eliminar la pregunta ${question.name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.questionService.deleteQuestion(question.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Pregunta ${question.name} eliminada.`,
              showConfirmButton: false,
              timer: 1500
            });
            this.questions = this.questions.filter(q => q.id !== question.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar la pregunta',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok'
            });
            console.error('Error al eliminar pregunta:', error);
          }
        );
      }
    });
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.fetchQuestions();
  }

  updateQuestion(id: number): void {
    this.router.navigate([`/questions/update/${id}`]);
  }

  navigateToCreateQuestion(): void {
    this.router.navigate(['/questions/create']);
  }

  exportToExcel(): void {
    const exportData = this.questions.map(question => ({
      ID: question.id,
      Pregunta: question.name,
      Valor: question.value,
      Evaluación: question.id_evaluation
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Preguntas');
    XLSX.writeFile(workbook, 'preguntas.xlsx');
  }
}
