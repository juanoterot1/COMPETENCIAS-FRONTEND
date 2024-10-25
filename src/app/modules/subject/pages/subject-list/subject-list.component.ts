import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { SubjectService } from '../../../../core/services/api/subject.service';
import { Subject } from '../../../../core/models/subject.model';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Asegúrate de importar FormsModule aquí
  templateUrl: './subject-list.component.html',
})
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(private subjectService: SubjectService, private router: Router) {}

  ngOnInit(): void {
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.subjectService.getSubjects().subscribe(
      (response) => {
        this.subjects = response.result;
        this.totalItems = this.subjects.length;
      },
      (error) => {
        console.error('Error fetching subjects:', error);
      }
    );
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchSubjects();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchSubjects();
    }
  }

  deleteSubject(subject: Subject): void {
    Swal.fire({
      title: `¿Eliminar la materia ${subject.name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjectService.deleteSubject(subject.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Materia ${subject.name} eliminada.`,
              showConfirmButton: false,
              timer: 1500
            });
            this.subjects = this.subjects.filter(s => s.id !== subject.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar la materia',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok'
            });
            console.error('Error al eliminar materia:', error);
          }
        );
      }
    });
  }

  updateItemsPerPage(event: Event): void {  // Definir este método
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.fetchSubjects();
  }

  updateSubject(id: number): void {
    this.router.navigate([`/subjects/update/${id}`]);
  }

  navigateToCreateSubject(): void {
    this.router.navigate(['/subjects/create']);
  }

  exportToExcel(): void {
    const exportData = this.subjects.map(subject => ({
      ID: subject.id,
      'Nombre de la Materia': subject.name,
      Código: subject.code,
      Facultad: subject.id_faculty
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Materias');
    XLSX.writeFile(workbook, 'materias.xlsx');
  }
}
