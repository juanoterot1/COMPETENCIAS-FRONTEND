// src/app/modules/questions/question.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { QuestionListComponent } from './pages/question-list/question-list.component';
import { QuestionCreateComponent } from './pages/question-create/question-create.component';
import { QuestionUpdateComponent } from './pages/question-update/question-update.component';

const routes: Routes = [
  { path: '', component: QuestionListComponent },
  { path: 'create', component: QuestionCreateComponent },
  { path: 'update/:id', component: QuestionUpdateComponent },
];

@NgModule({
  declarations: [
    QuestionListComponent,
    QuestionCreateComponent,
    QuestionUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class QuestionModule { }
