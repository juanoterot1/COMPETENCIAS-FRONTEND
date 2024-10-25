import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { FacultyListComponent } from './pages/faculty-list/faculty-list.component';
import { FacultyCreateComponent } from './pages/faculty-create/faculty-create.component';
import { FacultyUpdateComponent } from './pages/faculty-update/faculty-update.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FacultyListComponent,
    FacultyCreateComponent,
    FacultyUpdateComponent,
    RouterModule.forChild([
      { path: '', component: FacultyListComponent },
      { path: 'create', component: FacultyCreateComponent },
      { path: 'update/:id', component: FacultyUpdateComponent }
    ])
  ]
})
export class FacultyModule { }
