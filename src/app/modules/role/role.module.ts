import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes standalone directamente
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RoleCreateComponent } from './pages/role_create/role-create.component';
import { RoleUpdateComponent } from './pages/role_update/role-update.component';
import { RoleDetailComponent } from './pages/role-detail/role-detail.component';  // Importa el componente de detalle
import { RolePDFDetailComponent } from './pages/role-pdf-detail/role-pdf-detail.component';  // Importa el componente PDF

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // Importa los componentes standalone aquí
    RoleListComponent,
    RoleCreateComponent,  // Componente de creación de roles
    RoleUpdateComponent,  // Componente de actualización de roles
    RoleDetailComponent,  // Componente de detalle de roles
    RolePDFDetailComponent,  // Componente de PDF de roles
    RouterModule.forChild([
      { path: '', component: RoleListComponent },  // Ruta para la lista de roles
      { path: 'create', component: RoleCreateComponent },  // Ruta para crear rol
      { path: 'update/:id', component: RoleUpdateComponent },  // Ruta para actualizar rol
      { path: ':id', component: RoleDetailComponent },  // Ruta para ver detalles de rol
      { path: 'pdf/:id', component: RolePDFDetailComponent }  // Ruta para ver PDF de rol
    ])
  ]
})
export class RolesModule { }
