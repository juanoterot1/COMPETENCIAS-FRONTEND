import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { CommonModule } from '@angular/common'; // Para directivas comunes
import { RelationService } from '../../../../core/services/api/relation.service'; // Ajusta la ruta según tu estructura
import { UserService } from '../../../../core/services/api/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-relation-create',
  templateUrl: './relation-create.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RelationCreateComponent implements OnInit {
  nit: string = '';
  nombreCliente: string = ''; // Campo para el nombre del cliente
  cities: string[] = [];
  selectedCity: string = '';
  services: any[] = [];
  selectedService: any = null;
  contracts: any[] = [];
  selectedContract: any = null;
  gerentes: any[] = [];
  programadores: any[] = [];
  selectedGerente: string = '';
  selectedProgramador: string = '';

  constructor(
    private relationService: RelationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response: any) => {
        const users = response.result;
        
        // Construir displayName en el formato "Nombre Completo (nombre de usuario)"
        this.gerentes = users
          .filter((user: any) => user.id_role === 1)
          .map((user: any) => ({
            ...user,
            displayName: `${user.full_name} (${user.username})`
          }));
        
        this.programadores = users
          .filter((user: any) => user.id_role === 2)
          .map((user: any) => ({
            ...user,
            displayName: `${user.full_name} (${user.username})`
          }));
      },
      (error: any) => {
        console.error('Error al cargar los usuarios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar los usuarios',
          text: 'Por favor, inténtelo de nuevo más tarde.',
        });
      }
    );
}

  // Método para obtener el nombre del cliente por NIT
  getNombreClienteByNit(): void {
    if (this.nit.trim() !== '') {
      this.relationService.getNombreClienteByNit(this.nit).subscribe(
        (response: any) => {
          this.nombreCliente = response.result?.NOMBRE_CLI || 'Nombre no encontrado';
        },
        (error: any) => {
          console.error('Error al obtener el nombre del cliente:', error);
          this.nombreCliente = 'Nombre no encontrado';
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener el nombre del cliente',
            text: 'Por favor, inténtelo de nuevo más tarde.',
          });
        }
      );
    } else {
      this.nombreCliente = ''; // Limpiar el nombre del cliente si el NIT está vacío
    }
  }

  // Método para obtener ciudades por NIT
  getCitiesByNit(): void {
    if (this.nit.trim() !== '') {
      this.relationService.getCitiesByNit(this.nit).subscribe(
        (response: any) => {
          this.cities = response.result;
          // Limpiar selección de ciudad, servicios, contratos y otros al cambiar el NIT
          this.selectedCity = '';
          this.services = [];
          this.selectedService = null;
          this.contracts = [];
          this.selectedContract = null;

          if (this.cities.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'No se encontraron ciudades',
              text: 'El NIT ingresado no tiene ciudades asociadas.',
            });
          }
        },
        (error: any) => {
          console.error('Error al obtener ciudades:', error);
          this.cities = [];
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener ciudades',
            text: 'Por favor, inténtelo de nuevo más tarde.',
          });
        }
      );
    }
  }

  // Método para obtener contratos por NIT y ciudad
  getContracts(): void {
    if (this.selectedCity) {
      this.relationService.getContractsByNitAndCity(this.nit, this.selectedCity).subscribe(
        (response: any) => {
          this.contracts = response.result;
          // Limpiar selección de servicio al cambiar la ciudad
          this.selectedService = null;
          this.selectedContract = null;

          if (this.contracts.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'No se encontraron contratos',
              text: 'No hay contratos asociados a esta ciudad y NIT.',
            });
          }
        },
        (error: any) => {
          console.error('Error al obtener contratos:', error);
          this.contracts = [];
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener contratos',
            text: 'Por favor, inténtelo de nuevo más tarde.',
          });
        }
      );
    }
  }

  // Método para obtener servicios por contrato
  getServices(): void {
    if (this.selectedContract) {
      this.relationService.getServicesByContract(this.selectedContract.idReg).subscribe(
        (response: any) => {
          this.services = response.result;
          // Limpiar selección de servicio al cambiar el contrato
          this.selectedService = null;

          if (this.services.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'No se encontraron servicios',
              text: 'No hay servicios asociados a este contrato.',
            });
          }
        },
        (error: any) => {
          console.error('Error al obtener servicios:', error);
          this.services = [];
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener servicios',
            text: 'Por favor, inténtelo de nuevo más tarde.',
          });
        }
      );
    }
  }

  // Método para guardar la relación
  saveRelation(): void {
    if (!this.validateForm()) {
      return;
    }

    const relation = {
      service: Number(this.selectedService.CTRTS_COD),
      contract: Number(this.selectedContract.CTRT_COD),
      id_account_manager: Number(this.selectedGerente),
      id_programmer: Number(this.selectedProgramador),
    };

    this.relationService.createRelation(relation).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Relación guardada exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/relations/list']);
      },
      (error: any) => {
        console.error('Error al guardar la relación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar la relación',
          text: 'Por favor, inténtelo de nuevo más tarde.',
        });
      }
    );
  }

  // Método para validar el formulario antes de enviar
  validateForm(): boolean {
    if (!this.nit.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'NIT requerido',
        text: 'Por favor, ingresa el NIT del cliente.',
      });
      return false;
    }
    if (!this.selectedCity) {
      Swal.fire({
        icon: 'warning',
        title: 'Ciudad requerida',
        text: 'Por favor, selecciona una ciudad.',
      });
      return false;
    }
    if (!this.selectedContract) {
      Swal.fire({
        icon: 'warning',
        title: 'Contrato requerido',
        text: 'Por favor, selecciona un contrato.',
      });
      return false;
    }
    if (!this.selectedService) {
      Swal.fire({
        icon: 'warning',
        title: 'Servicio requerido',
        text: 'Por favor, selecciona un servicio.',
      });
      return false;
    }
    if (!this.selectedGerente) {
      Swal.fire({
        icon: 'warning',
        title: 'Gerente de cuenta requerido',
        text: 'Por favor, selecciona un gerente de cuenta.',
      });
      return false;
    }
    if (!this.selectedProgramador) {
      Swal.fire({
        icon: 'warning',
        title: 'Programador requerido',
        text: 'Por favor, selecciona un programador.',
      });
      return false;
    }
    return true;
  }

  // Método para cancelar y navegar al listado de relaciones
  cancel(): void {
    this.router.navigate(['/relations/list']); // Redirige a la ruta correcta del listado
  }
}
