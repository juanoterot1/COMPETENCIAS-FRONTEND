import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes standalone directamente
import { GradingMatrixListComponent } from './pages/grading-matrix-list/grading-matrix-list.component';
import { GradingMatrixCreateComponent } from './pages/grading-matrix-create/grading-matrix-create.component';
import { GradingMatrixUpdateComponent } from './pages/grading-matrix-update/grading-matrix-update.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // Importa los componentes standalone aquí
    GradingMatrixListComponent,
    GradingMatrixCreateComponent,  // Componente para crear grading matrix
    GradingMatrixUpdateComponent,  // Componente para actualizar grading matrix
    RouterModule.forChild([
      { path: '', component: GradingMatrixListComponent },  // Ruta para la lista de grading matrices
      { path: 'create', component: GradingMatrixCreateComponent },  // Ruta para crear grading matrix
      { path: 'update/:id', component: GradingMatrixUpdateComponent }  // Ruta para actualizar grading matrix
    ])
  ]
})
export class GradingMatrixModule { }
