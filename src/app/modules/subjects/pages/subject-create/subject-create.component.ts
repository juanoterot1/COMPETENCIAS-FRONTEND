// src/app/modules/subjects/pages/subject-create/subject-create.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { Faculty } from '../../../../core/models/faculty.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-subject-create',
  templateUrl: './subject-create.component.html',
})
export class SubjectCreateComponent implements OnInit {
  newSubject = {
    name: '',
    code: '',
    id_faculty: undefined,
  };
  faculties: Faculty[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private subjectService: SubjectService,
    private facultyService: FacultyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFaculties();
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe(
      (response: ApiResponse<Faculty[]>) => {
        this.faculties = response.result;
      },
      (error) => {
        console.error('Error loading faculties:', error);
        this.errorMessage = 'No se pudo cargar la lista de facultades';
      }
    );
  }

  createSubject(): void {
    if (!this.newSubject.name || !this.newSubject.code || !this.newSubject.id_faculty) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.isSubmitting = true;
    this.subjectService.createSubject(
      this.newSubject.name,
      this.newSubject.code,
      this.newSubject.id_faculty!,
      1 // Este es un valor temporal para idUser
    ).subscribe({
      next: () => {
        this.successMessage = 'Asignatura creada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/subjects']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al crear la asignatura:', error);
        this.errorMessage = 'Ocurrió un error al crear la asignatura';
        this.isSubmitting = false;
      }
    });
  }

  cancelCreation(): void {
    this.router.navigate(['/subjects']);
  }
}
