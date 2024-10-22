import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-user-pdf-detail',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './user-pdf-detail.component.html',
})
export class UserPDFDetailComponent implements OnInit {
  printTitle: string = 'UserDetail';
  userId!: number;
  user: any = {};
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUserData();
    this.printTitle = `UserDetail_ID_${this.userId}`;
  }

  private loadUserData(): void {
    this.isLoading = false;  // Simulación de la carga de datos
    this.user = { name: 'John Doe', dni: '12345678', id: this.userId }; // Datos de ejemplo
  }
}
