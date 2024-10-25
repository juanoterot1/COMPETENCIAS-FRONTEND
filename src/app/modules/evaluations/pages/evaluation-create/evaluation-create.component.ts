import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { UserService } from '../../../../core/services/api/user.service';
import { Subject } from '../../../../core/models/subject.model';
import { Faculty } from '../../../../core/models/faculty.models';
import { User } from '../../../../core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-create.component.html',
})
export class EvaluationCreateComponent implements OnInit {
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
    private router: Router
  ) {}

  ngOnInit(): void {
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

  createEvaluation(): void {
    const newEvaluation = {
      name: this.name,
      description: this.description,
      id_subject: this.id_subject,
      id_faculty: this.id_faculty,
      id_user: this.id_user,
      status: this.status
    };

    this.evaluationService.createEvaluation(newEvaluation).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Evaluación creada exitosamente.',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/evaluations']);
        });
      },
      (error) => {
        console.error('Error al crear la evaluación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear la evaluación',
        });
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/evaluations']);
  }
}
