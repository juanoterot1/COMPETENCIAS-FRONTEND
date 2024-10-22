import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RelationService } from '../../../../core/services/api/relation.service';
import { Relation } from '../../../../core/models/relation.model';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-relation-list',
  templateUrl: './relation-list.component.html',
})
export class RelationListComponent implements OnInit {
  relations: Relation[] = [];
  isLoading: boolean = false;

  // Filtros
  relationIdFilter: number | undefined;
  contractFilter: number | undefined;
  serviceFilter: number | undefined;
  accountManagerFilter: number | undefined;
  programmerFilter: number | undefined;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;
  hasNext: boolean = false;
  hasPrev: boolean = false;

  showFilters: boolean = false; // Controlar la visibilidad de los filtros

  constructor(
    private relationService: RelationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRelations();
  }

  // Obtener todas las relaciones con filtros
  fetchRelations(): void {
    this.isLoading = true;
  
    const filters = {
      relationId: this.relationIdFilter ?? undefined,
      contract: this.contractFilter ?? undefined,
      service: this.serviceFilter ?? undefined,
      accountManager: this.accountManagerFilter ?? undefined,
      programmer: this.programmerFilter ?? undefined,
    };
  
    this.relationService.getRelations(this.currentPage, this.itemsPerPage, filters).subscribe(
      (response: any) => {
        this.totalItems = response.total;
        this.totalPages = response.pages;
        this.hasNext = response.has_next;
        this.hasPrev = response.has_prev;
        this.currentPage = response.page;
        
        // Procesar las relaciones y agregar el formato de nombre (nombre completo) + (nombre de usuario)
        this.relations = (response.relations || response.items).map((relation: any) => {
          return {
            ...relation,
            account_manager_display: relation.account_manager
              ? `${relation.account_manager.full_name} (${relation.account_manager.username})`
              : 'Sin Asignar',
            programmer_display: relation.programmer
              ? `${relation.programmer.full_name} (${relation.programmer.username})`
              : 'Sin Asignar',
          };
        });
        
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error al obtener el listado #2:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener el listado #2',
          text: 'Por favor, inténtelo de nuevo más tarde.',
        });
      }
    );
  }

  // Exportar a Excel con estilos
  exportToExcel(): void {
    const exportData = this.relations.map(relation => ({
      "ID": relation.id,
      "Variable1": relation.contract,
      "Variable2": relation.service,
      "Variable3": relation.account_manager?.username || 'Sin Asignar',
      "Variable4": relation.programmer?.username || 'Sin Asignar'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Ajustar el ancho de las columnas
    const columnWidths = [
      { wpx: 100 }, // ID Relación
      { wpx: 150 }, // Contrato
      { wpx: 150 }, // Servicio
      { wpx: 200 }, // Gerente de Cuenta
      { wpx: 200 }  // Programador
    ];
    worksheet['!cols'] = columnWidths;

    // Aplicar estilos al encabezado
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center" }
      };
    }

    // Aplicar bordes a todas las celdas de datos
    for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            ...worksheet[cellAddress].s,
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } }
            }
          };
        }
      }
    }

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relaciones');

    XLSX.writeFile(workbook, 'relaciones_gerente_programador.xlsx');
  }

  // Aplicar filtros
  applyFilters(): void {
    this.currentPage = 1;
    this.fetchRelations();
  }

  // Resetear filtros
  resetFilters(): void {
    this.relationIdFilter = undefined;
    this.contractFilter = undefined;
    this.serviceFilter = undefined;
    this.accountManagerFilter = undefined;
    this.programmerFilter = undefined;
    this.applyFilters();
  }

  // Cambiar el número de elementos por página
  onItemsPerPageChange(newItemsPerPage: number): void {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
    this.fetchRelations();
  }

  // Navegar a crear nueva relación
  navigateToCreate(): void {
    this.router.navigate(['/relations/create']);
  }

  // Editar relación
  editRelation(relation: Relation): void {
    this.router.navigate([`/relations/edit/${relation.id}`]);
  }

  // Eliminar relación
  deleteRelation(relation: Relation): void {
    Swal.fire({
      title: `¿Eliminar la relación con ID ${relation.id}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.relationService.deleteRelation(relation.id!).subscribe(
          () => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Relación eliminada',
              showConfirmButton: false,
              timer: 1500,
            });
            this.fetchRelations();
          },
          (error: any) => {
            this.isLoading = false;
            console.error('Error al eliminar la relación:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar la relación',
              text: 'Por favor, inténtelo de nuevo más tarde.',
            });
          }
        );
      }
    });
  }

  // Paginación: Página anterior
  prevPage(): void {
    if (this.hasPrev) {
      this.currentPage--;
      this.fetchRelations();
    }
  }

  // Paginación: Página siguiente
  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.fetchRelations();
    }
  }

  // Alternar la visibilidad de los filtros
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
