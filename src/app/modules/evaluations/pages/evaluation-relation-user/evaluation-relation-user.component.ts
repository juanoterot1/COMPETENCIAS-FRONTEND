import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { UserService } from '../../../../core/services/api/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-relation-user',
  templateUrl: './evaluation-relation-user.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class EvaluationRelationUserComponent implements OnInit {
  selectedGerente: string | null = null;  // Gerente por nombre
  selectedProgramador: string | null = null;  // Programador por nombre
  gerentes: any[] = [];  // Lista de gerentes
  programadores: any[] = [];  // Lista de programadores

  evaluationId!: number;  // ID de la evaluación

  constructor(
    private evaluationService: EvaluationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.evaluationId = this.route.snapshot.params['id']; // Obtener el ID de la evaluación desde la URL
    this.loadEvaluationAndUsers();  // Cargar evaluación y usuarios
  }

  // Cargar evaluación y usuarios
  loadEvaluationAndUsers(): void {
    this.evaluationService.getEvaluationById(this.evaluationId).subscribe(
      (response) => {
        const evaluation = response.result;

        // Asignar los nombres del gerente y programador
        this.selectedGerente = evaluation.account_manager_name || null;
        this.selectedProgramador = evaluation.programmer_name || null;

        // Cargar los usuarios
        this.loadUsers();
      },
      (error) => {
        console.error('Error al obtener la evaluación:', error);
      }
    );
  }

  // Cargar gerentes y programadores
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        const users = response.result;
        this.gerentes = users.filter(user => user.id_role === 1);  // Filtrar gerentes
        this.programadores = users.filter(user => user.id_role === 2);  // Filtrar programadores
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  submitRelations(): void {
    if (!this.selectedGerente || !this.selectedProgramador) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Debes seleccionar un gerente y un programador',
      });
      return;
    }
  
    // Encuentra los IDs de los usuarios seleccionados
    const selectedGerenteId = this.gerentes.find(gerente => gerente.username === this.selectedGerente)?.id;
    const selectedProgramadorId = this.programadores.find(programador => programador.username === this.selectedProgramador)?.id;
  
    if (!selectedGerenteId || !selectedProgramadorId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo encontrar el ID del gerente o programador seleccionados',
      });
      return;
    }
  
    const requestBody = {
      id_account_manager: selectedGerenteId,  // Usar el ID del gerente
      id_programmer: selectedProgramadorId  // Usar el ID del programador
    };
  
    // Realizar la solicitud PUT al endpoint para actualizar la evaluación
    this.evaluationService.updateEvaluation(this.evaluationId, requestBody).subscribe(
      (response) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Relación guardada correctamente',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/evaluations']);
        });
      },
      (error) => {
        console.error('Error al actualizar la evaluación:', error);
      }
    );
  }
  
  cancel(): void {
    this.router.navigate(['/evaluations']);
  }
}
