import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { Faculty } from '../../../../core/models/faculty.model';

@Component({
  selector: 'app-faculty-list',
  templateUrl: './faculty-list.component.html',
})
export class FacultyListComponent implements OnInit {
  faculties: Faculty[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  nameFilter: string = '';
  showFilters: boolean = false;

  constructor(private facultyService: FacultyService, private router: Router) {}

  ngOnInit(): void {
    this.fetchFaculties();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.nameFilter = '';
    this.currentPage = 1;
    this.fetchFaculties();
  }

  fetchFaculties(): void {
    this.facultyService.getFaculties(this.currentPage, this.itemsPerPage, this.nameFilter).subscribe({
      next: (response) => {
        console.log('Response:', response); // Verificar la respuesta para entender la estructura
        this.faculties = response.result;

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
        console.error('Error fetching faculties:', error);
      },
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchFaculties();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchFaculties();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchFaculties();
    }
  }

  createFaculty(): void {
    this.router.navigate(['/faculty/create']);
  }

  editFaculty(id: number): void {
    this.router.navigate(['/faculty/update', id]);
  }

  deleteFaculty(id: number): void {
    this.facultyService.deleteFaculty(id).subscribe(() => {
      this.fetchFaculties();
    });
  }
}
