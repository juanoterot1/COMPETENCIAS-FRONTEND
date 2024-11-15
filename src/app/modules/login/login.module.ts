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
      { path: '', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
    ])
  ]
})
export class LoginModule {}
