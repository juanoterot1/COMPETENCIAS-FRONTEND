import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'users',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UsersModule)
  },
  {
    path: 'evaluations',
    loadChildren: () => import('./modules/evaluations/evaluation.module').then(m => m.EvaluationsModule)
  },
  {
    path: 'grading-matrix',
    loadChildren: () => import('./modules/grading-matrix/grading-matrix.module').then(m => m.GradingMatrixModule)
  },  
  {
    path: 'subjects', 
    loadChildren: () => import('./modules/subject/subject.module').then(m => m.SubjectsModule)
  },
  {
    path: 'faculties',
    loadChildren: () => import('./modules/faculty/faculty.module').then(m => m.FacultyModule)
  },
  {
    path: 'roles',
    loadChildren: () => import('./modules/role/role.module').then(m => m.RolesModule)
  },
  {
    path: 'questions',  // Añadida la nueva ruta para questions
    loadChildren: () => import('./modules/question/question.module').then(m => m.QuestionsModule)
  },
  {
    path: 'answers',  // Nueva ruta para answers
    loadChildren: () => import('./modules/answer/answer.module').then(m => m.AnswersModule)
  },
  { path: '**', redirectTo: '/' }  // Redirección para rutas no encontradas
];
