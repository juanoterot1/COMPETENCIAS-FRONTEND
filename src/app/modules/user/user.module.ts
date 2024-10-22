import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes standalone directamente
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserPDFDetailComponent } from './pages/user-pdf-detail/user-pdf-detail.component';
import { UserCreateComponent } from './pages/user_create/user-create.component';  // Importa el componente de creación
import { UserUpdateComponent } from './pages/user-update/user-update.component';  // Importa el componente de actualización

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // Importa los componentes standalone aquí
    UserListComponent,
    UserDetailComponent,
    UserPDFDetailComponent,
    UserCreateComponent,  // Importa el componente de creación de usuario
    UserUpdateComponent,  // Importa el componente de actualización de usuario
    RouterModule.forChild([
      { path: '', component: UserListComponent },
      { path: 'create', component: UserCreateComponent },  // Añade la ruta para crear usuario
      { path: ':id', component: UserDetailComponent },
      { path: 'pdf/:id', component: UserPDFDetailComponent },
      { path: 'update/:id', component: UserUpdateComponent }  // Añade la ruta para actualizar usuario
    ])
  ]
})
export class UsersModule { }
