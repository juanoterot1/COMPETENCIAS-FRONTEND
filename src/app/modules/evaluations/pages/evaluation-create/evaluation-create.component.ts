// src/app/modules/evaluations/pages/evaluation-create/evaluation-create.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { Evaluation } from '../../../../core/models/evaluation.model';
import { Faculty } from '../../../../core/models/faculty.model';
import { Subject } from '../../../../core/models/subject.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-evaluation-create',
  templateUrl: './evaluation-create.component.html',
})
export class EvaluationCreateComponent implements OnInit {
  newEvaluation: Partial<Evaluation> = {
    name: '',
    description: '',
    id_subject: 0,
    id_faculty: 0,
    status: 'active'
  };
  faculties: Faculty[] = [];
  subjects: Subject[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private evaluationService: EvaluationService,
    private facultyService: FacultyService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFaculties();
    this.loadSubjects();
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe(
      (response: ApiResponse<Faculty[]>) => {
        this.faculties = response.result;
      },
      (error) => {
        console.error('Error loading faculties:', error);
        this.errorMessage = 'No se pudieron cargar las facultades.';
      }
    );
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe(
      (response: ApiResponse<Subject[]>) => {
        this.subjects = response.result;
      },
      (error) => {
        console.error('Error loading subjects:', error);
        this.errorMessage = 'No se pudieron cargar las asignaturas.';
      }
    );
  }

  createEvaluation(): void {
    if (!this.newEvaluation.name || !this.newEvaluation.description || !this.newEvaluation.id_subject || !this.newEvaluation.id_faculty) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    this.isSubmitting = true;
    this.evaluationService.createEvaluation(this.newEvaluation, 1) // Reemplaza 1 con el ID real del usuario si es necesario
      .subscribe({
        next: () => {
          this.successMessage = 'Evaluación creada exitosamente';
          setTimeout(() => {
            this.router.navigate(['/evaluations']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating evaluation:', error);
          this.errorMessage = 'Ocurrió un error al crear la evaluación.';
          this.isSubmitting = false;
        }
      });
  }

  cancelCreation(): void {
    this.router.navigate(['/evaluations']);
  }
}
