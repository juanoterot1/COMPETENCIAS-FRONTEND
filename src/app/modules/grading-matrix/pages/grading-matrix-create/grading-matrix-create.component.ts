import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GradingMatrixService } from '../../../../core/services/api/grading-matrix.service';
import { SubjectService } from '../../../../core/services/api/subject.service'; // Importar SubjectService
import { Subject } from '../../../../core/models/subject.model';  // Importar el modelo Subject
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grading-matrix-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grading-matrix-create.component.html',
})
export class GradingMatrixCreateComponent implements OnInit {
  id_subject: number = 0;
  total_evaluations: number = 0;
  total_score: number = 0;
  recommendation: string = '';
  score: number = 0;
  document: string = '';

  subjects: Subject[] = []; // Array para almacenar las materias (subjects)

  constructor(
    private gradingMatrixService: GradingMatrixService,
    private subjectService: SubjectService, // Inyectar SubjectService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubjects(); // Cargar materias al inicializar el componente
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

  createGradingMatrix(): void {
    const newMatrix = {
      id_subject: this.id_subject,
      total_evaluations: this.total_evaluations,
      total_score: this.total_score,
      recommendation: this.recommendation,
      score: this.score,
      document: this.document,
    };

    this.gradingMatrixService.createGradingMatrix(newMatrix).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Grading Matrix creada exitosamente.',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/grading-matrix']);
        });
      },
      (error) => {
        console.error('Error al crear la Grading Matrix:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear la Grading Matrix',
        });
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/grading-matrix']);
  }
}
