import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { Faculty } from '../../../../core/models/faculty.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-faculty-create',
  templateUrl: './faculty-create.component.html',
})
export class FacultyCreateComponent implements OnInit {
  newFaculty: Partial<Faculty> = {
    name: '',
  };
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private facultyService: FacultyService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createFaculty(): void {
    if (!this.newFaculty.name) {
      this.errorMessage = 'El nombre de la facultad es obligatorio';
      return;
    }

    this.isSubmitting = true;
    this.facultyService.createFaculty(this.newFaculty.name!, 1) // Asume un valor temporal de idUser
      .subscribe({
        next: (response: ApiResponse<Faculty>) => {
          this.successMessage = 'Facultad creada exitosamente';
          setTimeout(() => {
            this.router.navigate(['/faculty']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = 'Ocurrió un error al crear la facultad';
          this.isSubmitting = false;
        }
      });
  }

  cancelCreation(): void {
    this.router.navigate(['/faculty']);
  }
}
