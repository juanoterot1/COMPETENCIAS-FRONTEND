// src/app/modules/subjects/subject.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectListComponent } from './pages/subject-list/subject-list.component';
import { SubjectCreateComponent } from './pages/subject-create/subject-create.component';
import { SubjectUpdateComponent } from './pages/subject-update/subject-update.component';

const routes: Routes = [
  { path: '', component: SubjectListComponent },
  { path: 'create', component: SubjectCreateComponent },
  { path: 'update/:id', component: SubjectUpdateComponent }
];

@NgModule({
  declarations: [
    SubjectListComponent,
    SubjectCreateComponent,
    SubjectUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SubjectModule {}
