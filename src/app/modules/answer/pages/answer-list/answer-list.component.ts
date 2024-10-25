import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnswerService } from '../../../../core/services/api/answer.service';
import { Answer } from '../../../../core/models/answer.model';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-answer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './answer-list.component.html',
})
export class AnswerListComponent implements OnInit {
  answers: Answer[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(private answerService: AnswerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAnswers();
  }

  fetchAnswers(): void {
    this.answerService.getAnswers().subscribe(
      (response) => {
        this.answers = response.result;
        this.totalItems = this.answers.length;
      },
      (error) => {
        console.error('Error fetching answers:', error);
      }
    );
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

  deleteAnswer(answer: Answer): void {
    Swal.fire({
      title: `¿Eliminar la respuesta ${answer.id}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.answerService.deleteAnswer(answer.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Respuesta ${answer.id} eliminada.`,
              showConfirmButton: false,
              timer: 1500
            });
            this.answers = this.answers.filter(a => a.id !== answer.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar la respuesta',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok'
            });
            console.error('Error al eliminar respuesta:', error);
          }
        );
      }
    });
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.fetchAnswers();
  }

  updateAnswer(id: number): void {
    this.router.navigate([`/answers/update/${id}`]);
  }

  navigateToCreateAnswer(): void {
    this.router.navigate(['/answers/create']);
  }

  exportToExcel(): void {
    const exportData = this.answers.map(answer => ({
      ID: answer.id,
      Respuesta: answer.answer_description,
      Evaluación: answer.id_evaluation,
      Pregunta: answer.id_question,
      Usuario: answer.id_user,
      Puntuación: answer.score
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Respuestas');
    XLSX.writeFile(workbook, 'respuestas.xlsx');
  }
}
