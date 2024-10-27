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
      { path: '', loadComponent: () => import('./pages/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: 'create', loadComponent: () => import('./pages/user_create/user-create.component').then(m => m.UserCreateComponent) },
      { path: 'update/:id', loadComponent: () => import('./pages/user-update/user-update.component').then(m => m.UserUpdateComponent) },
    ])
  ]
})
export class UserModule {}
