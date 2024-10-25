import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes standalone directamente
import { AnswerListComponent } from './pages/answer-list/answer-list.component';
import { AnswerCreateComponent } from './pages/answer-create/answer-create.component';
import { AnswerUpdateComponent } from './pages/answer-update/answer-update.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // Importa los componentes standalone aquí
    AnswerListComponent,
    AnswerCreateComponent,  // Componente de creación de Answer
    AnswerUpdateComponent,  // Componente de actualización de Answer
    RouterModule.forChild([
      { path: '', component: AnswerListComponent },  // Ruta para la lista de answers
      { path: 'create', component: AnswerCreateComponent },  // Ruta para crear answer
      { path: 'update/:id', component: AnswerUpdateComponent }  // Ruta para actualizar answer
    ])
  ]
})
export class AnswersModule { }
