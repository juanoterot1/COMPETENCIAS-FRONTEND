import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes standalone directamente
import { EvaluationListComponent } from './pages/evaluation-list/evaluation-list.component';
import { EvaluationDetailComponent } from './pages/evaluation-detail/evaluation-detail.component';
import { EvaluationProductsDetailComponent } from './pages/evaluation-products-detail/evaluation-products-detail.component';
import { EvaluationPDFDetailComponent } from './pages/evaluation-pdf-detail/evaluation-pdf-detail.component';
import { EvaluationRelationUserComponent } from './pages/evaluation-relation-user/evaluation-relation-user.component';
import { EvaluationFormComponent } from './pages/evaluation-form/evaluation-form.component'; // Importa el componente standalone

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    EvaluationListComponent,
    EvaluationDetailComponent,
    EvaluationProductsDetailComponent,
    EvaluationPDFDetailComponent,
    EvaluationRelationUserComponent,
    EvaluationFormComponent, // Importa directamente como standalone
    RouterModule.forChild([
      { path: '', component: EvaluationListComponent }, // Página principal del listado
      { path: 'form/:id', component: EvaluationFormComponent }, // Ruta del formulario
      { path: 'products/:id', component: EvaluationProductsDetailComponent }, // Detalles de productos
      { path: 'pdf/:id', component: EvaluationPDFDetailComponent }, // Detalles en PDF
      { path: 'relation-user/:id', component: EvaluationRelationUserComponent }, // Relación con usuario
      { path: ':id', component: EvaluationDetailComponent }, // Detalles de la evaluación, al final para evitar conflictos con otras rutas
    ])
  ]
})
export class EvaluationsModule { }
