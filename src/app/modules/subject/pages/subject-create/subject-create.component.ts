import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/api/subject.service';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import Swal from 'sweetalert2';
import { Faculty } from '../../../../core/models/faculty.models';

@Component({
  selector: 'app-subject-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject-create.component.html',
})
export class SubjectCreateComponent implements OnInit {
  name: string = '';
  code: string = '';
  id_faculty!: number;
  faculties: Faculty[] = [];

  constructor(
    private subjectService: SubjectService,
    private facultyService: FacultyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFaculties();
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((response) => {
      this.faculties = response.result;
    });
  }

  createSubject(): void {
    if (!this.name.trim() || !this.code.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre y el código son requeridos',
      });
      return;
    }

    const newSubject = { name: this.name, code: this.code, id_faculty: this.id_faculty };

    this.subjectService.createSubject(newSubject).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `La materia ${this.name} ha sido creada exitosamente.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/subjects']);
        });
      },
      (error) => {
        console.error('Error al crear la materia:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al crear la materia',
          text: 'Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/subjects']);
  }
}
