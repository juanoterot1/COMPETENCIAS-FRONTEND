// src/app/modules/subjects/pages/subject-update/subject-update.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { Faculty } from '../../../../core/models/faculty.model';
import { Subject } from '../../../../core/models/subject.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-subject-update',
  templateUrl: './subject-update.component.html',
})
export class SubjectUpdateComponent implements OnInit {
  subjectId: number = 0;
  subject: Partial<Subject> = {
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subjectId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchSubjectById();
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

  fetchSubjectById(): void {
    this.subjectService.getSubjectById(this.subjectId).subscribe(
      (response: ApiResponse<Subject>) => {
        this.subject = response.result;
      },
      (error) => {
        console.error('Error al obtener los detalles de la asignatura:', error);
        this.errorMessage = 'No se pudo cargar la información de la asignatura';
      }
    );
  }

  updateSubject(): void {
    if (!this.subject.name || !this.subject.code || !this.subject.id_faculty) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.isSubmitting = true;
    this.subjectService.updateSubject(
      this.subjectId,
      this.subject.name!,
      this.subject.code!,
      this.subject.id_faculty!,
      1 // Este es un valor temporal para idUser
    ).subscribe({
      next: () => {
        this.successMessage = 'Asignatura actualizada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/subjects']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al actualizar la asignatura:', error);
        this.errorMessage = 'Ocurrió un error al actualizar la asignatura';
        this.isSubmitting = false;
      }
    });
  }

  cancelUpdate(): void {
    this.router.navigate(['/subjects']);
  }
}
