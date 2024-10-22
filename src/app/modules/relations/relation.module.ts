import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { RelationCreateComponent } from './pages/relation-create/relation-create.component';
import { RelationListComponent } from './pages/relation-list/relation-list.component';
import { RelationUpdateComponent } from './pages/relation-update/relation-update.component'; // Importa el componente de actualización

@NgModule({
  declarations: [
    RelationListComponent,
    RelationUpdateComponent, // Declara el componente de actualización
  ],
  imports: [
    CommonModule,
    FormsModule,
    RelationCreateComponent, // Importa el componente de creación
    RouterModule.forChild([
      { path: 'create', component: RelationCreateComponent },
      { path: 'list', component: RelationListComponent },
      { path: 'edit/:id', component: RelationUpdateComponent }, // Ruta para editar relación
    ]),
  ],
})
export class RelationsModule {}
