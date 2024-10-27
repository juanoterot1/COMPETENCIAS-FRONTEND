// src/app/modules/subjects/pages/subject-list/subject-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { Subject } from '../../../../core/models/subject.model';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
})
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  nameFilter: string = '';
  codeFilter: string = '';
  showFilters: boolean = false;

  constructor(public router: Router, private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.fetchSubjects();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.nameFilter = '';
    this.codeFilter = '';
    this.currentPage = 1;
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.subjectService
      .getSubjects(this.currentPage, this.itemsPerPage, this.nameFilter, this.codeFilter)
      .subscribe({
        next: (response) => {
          this.subjects = response.result;

          if ('totalItems' in response && typeof response.totalItems === 'number') {
            this.totalItems = response.totalItems;
          } else if ('total' in response && typeof response.total === 'number') {
            this.totalItems = response.total;
          } else {
            this.totalItems = response.result.length;
          }

          // Calcular el total de páginas
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        },
        error: (error) => {
          console.error('Error fetching subjects:', error);
        },
      });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchSubjects();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchSubjects();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchSubjects();
    }
  }

  editSubject(id: number): void {
    this.router.navigate(['/subjects/update', id]);
  }

  deleteSubject(id: number): void {
    this.subjectService.deleteSubject(id).subscribe(() => {
      this.fetchSubjects();
    });
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1; // Resetear a la primera página
    this.fetchSubjects();
  }
}
