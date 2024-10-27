// src/app/modules/faculty/pages/faculty-update/faculty-update.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { Faculty } from '../../../../core/models/faculty.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-faculty-update',
  templateUrl: './faculty-update.component.html',
})
export class FacultyUpdateComponent implements OnInit {
  facultyId: number = 0;
  faculty: Partial<Faculty> = {
    name: '',
  };
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private facultyService: FacultyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.facultyId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchFacultyById();
  }

  fetchFacultyById(): void {
    this.facultyService.getFacultyById(this.facultyId).subscribe(
      (response: ApiResponse<Faculty>) => {
        this.faculty = response.result;
      },
      (error) => {
        console.error('Error al obtener los detalles de la facultad:', error);
        this.errorMessage = 'No se pudo cargar la información de la facultad.';
      }
    );
  }

  updateFaculty(): void {
    if (!this.faculty.name) {
      this.errorMessage = 'El nombre de la facultad es obligatorio';
      return;
    }

    this.isSubmitting = true;
    this.facultyService.updateFaculty(this.facultyId, this.faculty.name!, 1) // Asume un valor temporal de idUser, cámbialo si es necesario
      .subscribe({
        next: () => {
          this.successMessage = 'Facultad actualizada exitosamente';
          this.router.navigate(['/faculties']);
        },
        error: (error) => {
          console.error('Error al actualizar la facultad:', error);
          this.errorMessage = 'Ocurrió un error al actualizar la facultad';
          this.isSubmitting = false;
        }
      });
  }

  cancelUpdate(): void {
    this.router.navigate(['/faculties']);
  }
}
