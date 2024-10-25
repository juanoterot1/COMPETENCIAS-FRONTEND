import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-role-pdf-detail',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './role-pdf-detail.component.html',
})
export class RolePDFDetailComponent implements OnInit {
  printTitle: string = 'RoleDetail';
  roleId!: number;
  role: any = {};
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.roleId = +this.route.snapshot.paramMap.get('id')!;
    this.loadRoleData();
    this.printTitle = `RoleDetail_ID_${this.roleId}`;
  }

  private loadRoleData(): void {
    this.isLoading = false;  // Simulación de la carga de datos
    this.role = { role_name: 'Administrador', id: this.roleId, created_at: '2023-10-22' }; // Datos de ejemplo
  }
}
