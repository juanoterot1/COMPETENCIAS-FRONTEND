import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { Router } from '@angular/router';
import { FacultyService } from '../../../../core/services/api/faculty.service';
import { Faculty } from '../../../../core/models/faculty.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faculty-create',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Asegúrate de incluir CommonModule y FormsModule
  templateUrl: './faculty-create.component.html',
})
export class FacultyCreateComponent {
  name: string = '';

  constructor(
    private facultyService: FacultyService,
    private router: Router
  ) {}

  createFaculty(): void {
    const newFaculty: Faculty = {
      id: 0,
      name: this.name
    };

    this.facultyService.createFaculty(newFaculty).subscribe(
      () => {
        Swal.fire('¡Éxito!', 'Facultad creada exitosamente', 'success');
        this.router.navigate(['/faculties']);
      },
      (error) => {
        Swal.fire('Error', 'Error al crear la facultad', 'error');
        console.error('Error al crear facultad:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/faculties']);
  }
}
