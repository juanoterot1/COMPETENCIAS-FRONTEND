import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import Swal from 'sweetalert2';
import { Faculty } from '../../../../core/models/faculty.models';

@Component({
  selector: 'app-subject-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject-update.component.html',
})
export class SubjectUpdateComponent implements OnInit {
  subjectId!: number;
  name: string = '';
  code: string = '';
  id_faculty!: number;
  faculties: Faculty[] = [];

  constructor(
    private subjectService: SubjectService,
    private facultyService: FacultyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subjectId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchSubjectDetails();
    this.loadFaculties();
  }

  fetchSubjectDetails(): void {
    this.subjectService.getSubjectById(this.subjectId).subscribe(
      (response) => {
        const subject = response.result;
        if (subject) {
          this.name = subject.name;
          this.code = subject.code;
          this.id_faculty = subject.id_faculty;
        } else {
          console.error('Subject not found');
        }
      },
      (error) => {
        console.error('Error al obtener los detalles de la materia:', error);
      }
    );
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((response) => {
      this.faculties = response.result;
    });
  }

  updateSubject(): void {
    const updatedSubject = { name: this.name, code: this.code, id_faculty: this.id_faculty };

    this.subjectService.updateSubject(this.subjectId, updatedSubject).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Materia actualizada exitosamente',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/subjects']);
        });
      },
      (error) => {
        Swal.fire('Error', 'Error al actualizar la materia', 'error');
        console.error('Error al actualizar la materia:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/subjects']);
  }
}
