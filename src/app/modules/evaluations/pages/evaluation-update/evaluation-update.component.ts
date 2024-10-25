import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { UserService } from '../../../../core/services/api/user.service';
import { Subject } from '../../../../core/models/subject.model';
import { Faculty } from '../../../../core/models/faculty.models';
import { User } from '../../../../core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-update.component.html',
})
export class EvaluationUpdateComponent implements OnInit {
  evaluationId!: number;
  name: string = '';
  description: string = '';
  id_subject: number = 0;
  id_faculty: number = 0;
  id_user: number = 0;
  status: string = 'Pending';
  subjects: Subject[] = [];
  faculties: Faculty[] = [];
  users: User[] = [];

  constructor(
    private evaluationService: EvaluationService,
    private subjectService: SubjectService,
    private facultyService: FacultyService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.evaluationId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchEvaluationDetails();
    this.loadSubjects();
    this.loadFaculties();
    this.loadUsers();
  }

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

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe(
      (response) => {
        this.faculties = response.result;
      },
      (error) => {
        console.error('Error al cargar las facultades:', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.result;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  fetchEvaluationDetails(): void {
    this.evaluationService.getEvaluationById(this.evaluationId).subscribe(
      (response) => {
        const evaluation = response.result;
        this.name = evaluation.name;
        this.description = evaluation.description;
        this.id_subject = evaluation.id_subject;
        this.id_faculty = evaluation.id_faculty;
        this.id_user = evaluation.id_user;
        this.status = evaluation.status;
      },
      (error) => {
        console.error('Error al obtener los detalles de la evaluación:', error);
      }
    );
  }

  updateEvaluation(): void {
    const updatedEvaluation = {
      name: this.name,
      description: this.description,
      id_subject: this.id_subject,
      id_faculty: this.id_faculty,
      id_user: this.id_user,
      status: this.status
    };

    this.evaluationService.updateEvaluation(this.evaluationId, updatedEvaluation).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Evaluación actualizada exitosamente.',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/evaluations']);
        });
      },
      (error) => {
        console.error('Error al actualizar la evaluación:', error);
        Swal.fire('Error', 'Error al actualizar la evaluación', 'error');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/evaluations']);
  }
}
