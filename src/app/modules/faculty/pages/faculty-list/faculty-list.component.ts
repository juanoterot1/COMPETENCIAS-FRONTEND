import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { RouterModule, Router } from '@angular/router';  // Importa Router para navegación
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { Faculty } from '../../../../core/models/faculty.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faculty-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  // Asegúrate de incluir CommonModule y FormsModule
  templateUrl: './faculty-list.component.html',
})
export class FacultyListComponent implements OnInit {
  faculties: Faculty[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  sortBy: 'id' | 'name' = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  showFilters: boolean = false;

  constructor(private facultyService: FacultyService, private router: Router) {}

  ngOnInit(): void {
    this.fetchFaculties();
  }

  fetchFaculties(): void {
    this.facultyService.getFaculties().subscribe(
      (response) => {
        this.faculties = response.result;
        this.totalItems = this.faculties.length;
      },
      (error) => {
        console.error('Error fetching faculties:', error);
      }
    );
  }

  

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1;
    this.fetchFaculties();
  }

  navigateToCreateFaculty(): void {
    this.router.navigate(['/faculties/create']);  // Lógica de navegación para crear nueva facultad
  }

  exportToExcel(): void {
    // Implementa la exportación a Excel
  }

  toggleSort(field: 'id' | 'name'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
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

  viewFaculty(id: number): void {
    this.router.navigate([`/faculties/update/${id}`]);  // Navega hacia la página de edición de la facultad
  }
  deleteFaculty(faculty: Faculty): void {
    Swal.fire({
      title: `¿Eliminar la facultad ${faculty.name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facultyService.deleteFaculty(faculty.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Facultad ${faculty.name} eliminada.`,
              showConfirmButton: false,
              timer: 1500
            });
            this.faculties = this.faculties.filter(f => f.id !== faculty.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar la facultad',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok'
            });
            console.error('Error al eliminar facultad:', error);
          }
        );
      }
    });
  }
}
