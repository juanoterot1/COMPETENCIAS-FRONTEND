import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes standalone directamente
import { QuestionListComponent } from './pages/question-list/question-list.component';
import { QuestionCreateComponent } from './pages/question-create/question-create.component';
import { QuestionUpdateComponent } from './pages/question-update/question-update.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // Importa los componentes standalone aquí
    QuestionListComponent,
    QuestionCreateComponent,  // Componente para crear Question
    QuestionUpdateComponent,  // Componente para actualizar Question
    RouterModule.forChild([
      { path: '', component: QuestionListComponent },  // Ruta para la lista de Questions
      { path: 'create', component: QuestionCreateComponent },  // Ruta para crear Question
      { path: 'update/:id', component: QuestionUpdateComponent }  // Ruta para actualizar Question
    ])
  ]
})
export class QuestionsModule { }
