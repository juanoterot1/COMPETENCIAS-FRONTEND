import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { UserService } from '../../../../core/services/api/user.service';
import { Evaluation } from '../../../../core/models/evaluation.model';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'; // Importación correcta de jwt-decode
import { CookieService } from 'ngx-cookie-service';
import * as XLSX from 'xlsx'; // Importación para exportar a Excel

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './evaluation-list.component.html',
})
export class EvaluationListComponent implements OnInit, OnDestroy {
  evaluations: Evaluation[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;

  // Filtros
  dniFilter: string = '';
  fullNameFilter: string = '';
  jobTitleFilter: string = '';
  contractFilter: string = '';
  serviceFilter: string = '';
  statusFilter: string = 'sin respuesta'; // Filtro de estado predeterminado

  // Ordenamiento
  sortBy: 'id' | 'full_name' = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Control de filtros y modal
  showFilters: boolean = false;
  showDeleteModal: boolean = false;
  evaluationToDelete: Evaluation | null = null;

  isLoading: boolean = false; // Añadido para controlar el estado de carga

  private routerSubscription!: Subscription;

  // Añadimos las propiedades userId y role
  userId: number = 0;
  role: number = 0;

  constructor(
    private evaluationService: EvaluationService,
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService // Para acceder a las cookies
  ) {}

  ngOnInit(): void {
    const token = this.cookieService.get('access_token'); // Obtiene el token de las cookies
    const decodedToken: any = jwtDecode(token); // Decodifica el token JWT

    // Extrae el nombre de usuario (o correo) y elimina el prefijo "azure-eva_"
    let loggedInUsername = decodedToken.username;
    if (loggedInUsername.includes('_')) {
      loggedInUsername = loggedInUsername.split('_')[1]; // Elimina el prefijo
    }

    // Verifica el email del usuario en el backend
    this.userService.getUserByEmail(loggedInUsername).subscribe((userResponse) => {
      this.userId = userResponse.result.id; // Almacena el ID del usuario autenticado
      this.role = userResponse.result.id_role; // Almacena el rol del usuario autenticado

      // Llamamos a fetchEvaluations sin pasar el ID y el rol
      this.fetchEvaluations();
    });

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/evaluation-list') || event.url.includes('/evaluations')) {
          this.fetchEvaluations(); // Refresca la lista de evaluaciones si es necesario
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Función para alternar la visibilidad de los filtros
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // Función para obtener las evaluaciones y filtrarlas por el ID del usuario actual y el rol
  fetchEvaluations(): void {
    this.isLoading = true; // Mostrar el indicador de carga
    console.log('Fetching evaluations for user ID:', this.userId, 'with role:', this.role); // Log del ID y rol del usuario actual

    const params: any = {
      page: this.currentPage,
      per_page: this.itemsPerPage,
      status: this.statusFilter, // Añadir el filtro de estado
    };

    // Si es Gerente (role 1), buscamos por id_account_manager
    if (this.role === 1) {
      params.id_account_manager = this.userId.toString();
    }

    // Si es Programador (role 2), buscamos por id_programmer
    if (this.role === 2) {
      params.id_programmer = this.userId.toString();
    }

    // Añadir otros filtros si están definidos
    if (this.dniFilter) {
      params.dni = this.dniFilter;
    }
    if (this.fullNameFilter) {
      params.full_name = this.fullNameFilter;
    }
    if (this.jobTitleFilter) {
      params.job_title = this.jobTitleFilter;
    }
    if (this.contractFilter) {
      params.contract = this.contractFilter;
    }
    if (this.serviceFilter) {
      params.service = this.serviceFilter;
    }

    // Llamar a la API con los parámetros adecuados
    this.evaluationService.getEvaluationsByUser(this.userId, params).subscribe(
      (response) => {
        console.log('Evaluations response:', response); // Log de las evaluaciones recibidas

        const filteredEvaluations = response.result;

        // Asignar responseStatus basándose en evaluation.status
        this.evaluations = filteredEvaluations.map((evaluation) => ({
          ...evaluation,
          responseStatus: evaluation.status === 'con respuesta',
          showDetails: false, // Inicializa el campo showDetails en falso
        }));

        console.log('Filtered Evaluations:', this.evaluations); // Log de las evaluaciones filtradas

        this.totalItems = response.result.length; // Actualiza el total de evaluaciones
        this.isLoading = false; // Ocultar el indicador de carga
      },
      (error) => {
        console.error('Error fetching evaluations:', error);
        this.isLoading = false; // Ocultar el indicador de carga incluso si hay error
      }
    );
  }

  // Función para exportar a Excel
  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(
      this.evaluations.map((evaluation) => ({
        ID: evaluation.id,
        Colaborador: evaluation.full_name,
        DNI: evaluation.dni,
        Cargo: evaluation.job_title,
        Contrato: evaluation.contract,
        Servicio: evaluation.service,
        "Días Restantes": evaluation.termination_days,
        Estado: evaluation.responseStatus ? 'Con respuesta' : 'Sin respuesta',
        "Gerente de Cuenta": evaluation.account_manager_name || 'Sin asignar',
        Programador: evaluation.programmer_name || 'Sin asignar',
        "Fecha Generación": evaluation.date_generation,
        "Fecha Antigüedad": evaluation.date_seniority,
        Delegación: evaluation.name_delegation
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluaciones');
    XLSX.writeFile(workbook, 'Evaluaciones.xlsx');
  }

  // Lógica para alternar la expansión de detalles usando el ID en lugar del índice
  toggleDetails(evaluation: Evaluation): void {
    evaluation.showDetails = !evaluation.showDetails;
  }

  // Aplicar filtros de búsqueda con verificación de la cookie
  applyFilters(): void {
    const token = this.cookieService.get('access_token'); // Verifica si existe el token
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede filtrar sin estar autenticado. Por favor, inicia sesión.',
        confirmButtonText: 'Ok',
      });
      return; // Salir de la función si no hay token
    }

    this.currentPage = 1;
    this.fetchEvaluations();
  }

  // Reiniciar filtros (incluyendo la validación de la cookie)
  resetFilters(): void {
    const token = this.cookieService.get('access_token'); // Verifica si existe el token
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede filtrar sin estar autenticado. Por favor, inicia sesión.',
        confirmButtonText: 'Ok',
      });
      return; // Salir de la función si no hay token
    }

    this.dniFilter = '';
    this.fullNameFilter = '';
    this.jobTitleFilter = '';
    this.contractFilter = '';
    this.serviceFilter = '';
    this.statusFilter = 'sin respuesta'; // Resetear el filtro de status
    this.applyFilters();
  }

  // Actualizar elementos por página sin recargar las evaluaciones
  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value); // Solo actualizamos el número de items por página
    this.currentPage = 1; // Reiniciamos a la primera página
    this.fetchEvaluations();
  }

  // Función para alternar el ordenamiento
  toggleSort(field: 'id' | 'full_name'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.fetchEvaluations();
  }

  // Cambiar a la página siguiente
  nextPage(): void {
    this.currentPage++;
    this.fetchEvaluations();
  }

  // Cambiar a la página anterior
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchEvaluations();
    }
  }

  viewEvaluation(evaluation: Evaluation): void {
    if (evaluation.responseStatus) {
      Swal.fire({
        icon: 'warning',
        title: 'Esta evaluación ya tiene una respuesta',
        text: 'Esta evaluación ya tiene una respuesta registrada.',
        confirmButtonText: 'Ok',
      });
    } else {
      // Redirige a la ruta correcta para el formulario de la evaluación
      this.router.navigate([`/evaluations/form/${evaluation.id}`]);
    }
  }

  // Lógica para relacionar Gerente de Cuenta/Programador
  linkAccountManager(evaluation: Evaluation): void {
    this.router.navigate([`/evaluations/relation-user`, evaluation.id]);
  }

  // Método que se llama cuando se hace clic en "Eliminar"
  deleteEvaluation(evaluation: Evaluation): void {
    Swal.fire({
      title: `¿Eliminar la evaluación de ${evaluation.full_name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.evaluationService.deleteEvaluation(evaluation.id).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Evaluación de ${evaluation.full_name} eliminada.`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.evaluations = this.evaluations.filter((e) => e.id !== evaluation.id);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al eliminar evaluación',
              text: 'Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Ok',
            });
            console.error('Error al eliminar evaluación:', error);
          }
        );
      }
    });
  }
}
