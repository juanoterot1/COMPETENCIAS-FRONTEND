import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// No se declaran componentes standalone; solo se importan en el routing
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', loadComponent: () => import('./pages/feedback-list/feedback-list.component').then(m => m.FeedbackListComponent) },
      { path: 'create', loadComponent: () => import('./pages/feedback-create/feedback-create.component').then(m => m.FeedbackCreateComponent) },
    ])
  ]
})
export class FeedbackModule {}
