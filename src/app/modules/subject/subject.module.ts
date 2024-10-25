import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes standalone directamente
import { SubjectListComponent } from './pages/subject-list/subject-list.component';
import { SubjectCreateComponent } from './pages/subject-create/subject-create.component';
import { SubjectUpdateComponent } from './pages/subject-update/subject-update.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // Importa los componentes standalone aquí
    SubjectListComponent,
    SubjectCreateComponent,  // Componente para crear Subject
    SubjectUpdateComponent,  // Componente para actualizar Subject
    RouterModule.forChild([
      { path: '', component: SubjectListComponent },  // Ruta para la lista de Subjects
      { path: 'create', component: SubjectCreateComponent },  // Ruta para crear Subject
      { path: 'update/:id', component: SubjectUpdateComponent }  // Ruta para actualizar Subject
    ])
  ]
})
export class SubjectsModule { }
