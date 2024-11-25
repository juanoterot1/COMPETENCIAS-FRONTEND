// src/app/modules/evaluations/pages/evaluation-update/evaluation-update.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { Evaluation } from '../../../../core/models/evaluation.model';
import { Faculty } from '../../../../core/models/faculty.model';
import { Subject } from '../../../../core/models/subject.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-evaluation-update',
  templateUrl: './evaluation-update.component.html',
})
export class EvaluationUpdateComponent implements OnInit {
  evaluationId: number = 0;
  evaluation: Partial<Evaluation> = {
    name: '',
    description: '',
    id_subject: 0,
    id_faculty: 0,
    status: 'active',
  };
  faculties: Faculty[] = [];
  subjects: Subject[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  idUser: number = 1; // ID del usuario (ajústalo según tu lógica de autenticación)

  constructor(
    private evaluationService: EvaluationService,
    private facultyService: FacultyService,
    private subjectService: SubjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.evaluationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadFaculties();
    this.loadSubjects();
    this.fetchEvaluationById();
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe({
      next: (response: ApiResponse<Faculty[]>) => {
        this.faculties = response.result;
      },
      error: (error) => {
        console.error('Error loading faculties:', error);
        this.errorMessage = 'No se pudieron cargar las facultades.';
      },
    });
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (response: ApiResponse<Subject[]>) => {
        this.subjects = response.result;
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.errorMessage = 'No se pudieron cargar las asignaturas.';
      },
    });
  }

  fetchEvaluationById(): void {
    this.evaluationService.getEvaluationById(this.evaluationId).subscribe({
      next: (response: ApiResponse<Evaluation>) => {
        this.evaluation = response.result;
      },
      error: (error) => {
        console.error('Error fetching evaluation details:', error);
        this.errorMessage = 'No se pudo cargar la información de la evaluación.';
      },
    });
  }

  updateEvaluation(): void {
    if (!this.evaluation.name || !this.evaluation.description || !this.evaluation.id_subject || !this.evaluation.id_faculty) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    this.isSubmitting = true;

    this.evaluationService.updateEvaluation(this.evaluationId, this.evaluation, this.idUser).subscribe({
      next: () => {
        this.successMessage = 'Evaluación actualizada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/evaluations']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating evaluation:', error);
        this.errorMessage = 'Ocurrió un error al actualizar la evaluación.';
        this.isSubmitting = false;
      },
    });
  }

  cancelUpdate(): void {
    this.router.navigate(['/evaluations']);
  }
}
