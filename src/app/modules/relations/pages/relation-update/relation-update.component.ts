import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { RelationService } from '../../../../core/services/api/relation.service';
import { UserService } from '../../../../core/services/api/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-relation-update',
  templateUrl: './relation-update.component.html',
})
export class RelationUpdateComponent implements OnInit {
  nit: string = '';
  nombreCliente: string = ''; // Nueva propiedad para el nombre del cliente
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
  relationId: number;

  constructor(
    private route: ActivatedRoute,
    private relationService: RelationService,
    private userService: UserService,
    private router: Router
  ) {
    this.relationId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRelation();
  }

  // Método para cargar la relación existente
  loadRelation(): void {
    this.relationService.getRelationById(this.relationId).subscribe(
      (response: any) => {
        const relation = response.result;
        this.nit = relation.nit;
        this.selectedCity = relation.city;
        this.selectedContract = relation.contract;
        this.selectedService = relation.service;
        this.selectedGerente = relation.id_account_manager; // Aquí se selecciona el gerente actual
        this.selectedProgramador = relation.id_programmer;  // Aquí se selecciona el programador actual

        this.getNombreClienteByNit(); // Obtener el nombre del cliente
        this.getCitiesByNit(); // Para obtener las ciudades y contratos relacionados con el NIT
      },
      (error: any) => {
        console.error('Error al cargar la relación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar la relación',
          text: 'Por favor, inténtelo de nuevo más tarde.',
        });
      }
    );
  }

  // Método para cargar el nombre del cliente por NIT
  getNombreClienteByNit(): void {
    if (this.nit.trim() !== '') {
      this.relationService.getNombreClienteByNit(this.nit).subscribe(
        (response: any) => {
          this.nombreCliente = response.result.nombre; // Asignar el nombre del cliente
        },
        (error: any) => {
          console.error('Error al obtener el nombre del cliente:', error);
          this.nombreCliente = 'No encontrado'; // En caso de error, muestra un mensaje
        }
      );
    }
  }

  // Método para cargar gerentes y programadores
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

        // Seleccionar el gerente y programador actual
        this.selectedGerente = this.selectedGerente ? this.selectedGerente : this.gerentes[0]?.id;
        this.selectedProgramador = this.selectedProgramador ? this.selectedProgramador : this.programadores[0]?.id;
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

  // Método para obtener ciudades por NIT
  getCitiesByNit(): void {
    if (this.nit.trim() !== '') {
      this.relationService.getCitiesByNit(this.nit).subscribe(
        (response: any) => {
          this.cities = response.result;
          this.getContracts(); // Obtener los contratos para el NIT y ciudad seleccionada
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
          this.getServices(); // Obtener los servicios para el contrato seleccionado
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

  // Método para actualizar la relación
  updateRelation(): void {
    if (!this.validateForm()) {
      return;
    }

    const relation = {
      service: Number(this.selectedService.CTRTS_COD),
      contract: Number(this.selectedContract.CTRT_COD),
      id_account_manager: Number(this.selectedGerente),
      id_programmer: Number(this.selectedProgramador),
    };

    this.relationService.updateRelation(this.relationId, relation).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Relación actualizada exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/relations/list']);
      },
      (error: any) => {
        console.error('Error al actualizar la relación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar la relación',
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
    this.router.navigate(['/relations/list']);
  }
}
