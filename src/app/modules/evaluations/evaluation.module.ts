// src/app/modules/evaluations/evaluation.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { EvaluationListComponent } from './pages/evaluation-list/evaluation-list.component';
import { EvaluationCreateComponent } from './pages/evaluation-create/evaluation-create.component';
import { EvaluationUpdateComponent } from './pages/evaluation-update/evaluation-update.component';
import { EvaluationFormComponent } from './pages/evaluation-form/evaluation-form.component'; // Importación directa

const routes: Routes = [
  { path: '', component: EvaluationListComponent },
  { path: 'create', component: EvaluationCreateComponent },
  { path: 'update/:id', component: EvaluationUpdateComponent },
  { path: 'view/:id', loadComponent: () => import('./pages/evaluation-form/evaluation-form.component').then(m => m.EvaluationFormComponent) }, // Cargar como standalone
];

@NgModule({
  declarations: [
    EvaluationListComponent,
    EvaluationCreateComponent,
    EvaluationUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class EvaluationModule { }
