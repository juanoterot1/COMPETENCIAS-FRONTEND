import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FacultyListComponent } from './pages/faculty-list/faculty-list.component';
import { FacultyUpdateComponent } from './pages/faculty-update/faculty-update.component';
import { FacultyCreateComponent } from './pages/faculty_create/faculty-create.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    FacultyListComponent,
    FacultyUpdateComponent,
    FacultyCreateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ConfirmDialogComponent,
    RouterModule.forChild([
      { path: '', component: FacultyListComponent },
      { path: 'create', component: FacultyCreateComponent },
      { path: 'update/:id', component: FacultyUpdateComponent },
    ]),
  ],
})
export class FacultyModule {}
