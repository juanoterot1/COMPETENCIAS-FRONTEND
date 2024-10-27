// src/app/modules/answers/answer.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AnswerListComponent } from './pages/answer-list/answer-list.component';
import { AnswerCreateComponent } from './pages/answer-create/answer-create.component';
import { AnswerUpdateComponent } from './pages/answer-update/answer-update.component';

const routes: Routes = [
  { path: '', component: AnswerListComponent },
  { path: 'create', component: AnswerCreateComponent },
  { path: 'update/:id', component: AnswerUpdateComponent },
];

@NgModule({
  declarations: [
    AnswerListComponent,
    AnswerCreateComponent,
    AnswerUpdateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AnswerModule { }
