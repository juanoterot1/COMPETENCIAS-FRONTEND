import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes standalone directamente
import { EvaluationListComponent } from './pages/evaluation-list/evaluation-list.component';
import { EvaluationCreateComponent } from './pages/evaluation-create/evaluation-create.component';
import { EvaluationUpdateComponent } from './pages/evaluation-update/evaluation-update.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // Importa los componentes standalone aquí
    EvaluationListComponent,
    EvaluationCreateComponent,  // Componente para crear Evaluación
    EvaluationUpdateComponent,  // Componente para actualizar Evaluación
    RouterModule.forChild([
      { path: '', component: EvaluationListComponent },  // Ruta para la lista de Evaluaciones
      { path: 'create', component: EvaluationCreateComponent },  // Ruta para crear Evaluación
      { path: 'update/:id', component: EvaluationUpdateComponent }  // Ruta para actualizar Evaluación
    ])
  ]
})
export class EvaluationsModule { }
