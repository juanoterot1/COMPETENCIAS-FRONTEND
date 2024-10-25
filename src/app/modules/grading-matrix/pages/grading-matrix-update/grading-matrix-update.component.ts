import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GradingMatrixService } from '../../../../core/services/api/grading-matrix.service';
import { SubjectService } from '../../../../core/services/api/subject.service';  // Importar SubjectService
import { Subject } from '../../../../core/models/subject.model';  // Importar el modelo de Subject
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grading-matrix-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grading-matrix-update.component.html',
})
export class GradingMatrixUpdateComponent implements OnInit {
  gradingMatrixId!: number;
  id_subject!: number;
  total_evaluations!: number;
  total_score!: number;
  recommendation!: string;
  score!: number;
  document!: string;

  subjects: Subject[] = [];  // Array para almacenar las materias (subjects)

  constructor(
    private gradingMatrixService: GradingMatrixService,
    private subjectService: SubjectService,  // Inyectar SubjectService
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gradingMatrixId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchGradingMatrixDetails();
    this.loadSubjects();  // Cargar las materias disponibles
  }

  // Método para cargar las materias
  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe(
      (response) => {
        this.subjects = response.result;
      },
      (error) => {
        console.error('Error al cargar las materias:', error);
      }
    );
  }

  fetchGradingMatrixDetails(): void {
    this.gradingMatrixService.getGradingMatrixById(this.gradingMatrixId).subscribe(
      (response) => {
        const matrix = response.result;
        this.id_subject = matrix.id_subject;
        this.total_evaluations = matrix.total_evaluations;
        this.total_score = matrix.total_score;
        this.recommendation = matrix.recommendation;
        this.score = matrix.score;
        this.document = matrix.document;
      },
      (error) => {
        console.error('Error al obtener los detalles de la Grading Matrix:', error);
      }
    );
  }

  updateGradingMatrix(): void {
    const updatedMatrix = {
      id_subject: this.id_subject,
      total_evaluations: this.total_evaluations,
      total_score: this.total_score,
      recommendation: this.recommendation,
      score: this.score,
      document: this.document,
    };

    this.gradingMatrixService.updateGradingMatrix(this.gradingMatrixId, updatedMatrix).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Grading Matrix actualizada exitosamente.',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/grading-matrix']);
        });
      },
      (error) => {
        console.error('Error al actualizar la Grading Matrix:', error);
        Swal.fire('Error', 'Error al actualizar la Grading Matrix', 'error');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/grading-matrix']);
  }
}
