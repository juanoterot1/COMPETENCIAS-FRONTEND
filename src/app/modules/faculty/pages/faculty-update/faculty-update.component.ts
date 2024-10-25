import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { Faculty } from '../../../../core/models/faculty.models';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importa FormsModule

@Component({
  selector: 'app-faculty-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-update.component.html',
})
export class FacultyUpdateComponent implements OnInit {
  facultyId!: number;
  name: string = '';

  constructor(
    private route: ActivatedRoute,
    private facultyService: FacultyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.facultyId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchFacultyDetails();
  }

  fetchFacultyDetails(): void {
    this.facultyService.getFacultyById(this.facultyId).subscribe(
      (response) => {
        this.name = response.result.name;
      },
      (error) => {
        console.error('Error al obtener los detalles de la facultad:', error);
      }
    );
  }

  updateFaculty(): void {
    const updatedFaculty: Partial<Faculty> = {
      name: this.name
    };

    this.facultyService.updateFaculty(this.facultyId, updatedFaculty as Faculty).subscribe(
      () => {
        Swal.fire('¡Éxito!', 'Facultad actualizada exitosamente', 'success');
        this.router.navigate(['/faculties']);
      },
      (error) => {
        Swal.fire('Error', 'Error al actualizar la facultad', 'error');
        console.error('Error al actualizar facultad:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/faculties']);
  }
}
