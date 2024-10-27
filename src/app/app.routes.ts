import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirige la raíz al login
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',  // Ruta protegida para el dashboard
    component: HomeComponent,
    canActivate: [AuthGuard]  // Protege el acceso al dashboard
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UsersModule),
    canActivate: [AuthGuard]  // Protege el acceso al módulo de usuarios
  },
  {
    path: 'evaluations',
    loadChildren: () => import('./modules/evaluations/evaluation.module').then(m => m.EvaluationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'grading-matrix',
    loadChildren: () => import('./modules/grading-matrix/grading-matrix.module').then(m => m.GradingMatrixModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'subjects',
    loadChildren: () => import('./modules/subject/subject.module').then(m => m.SubjectsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'faculties',
    loadChildren: () => import('./modules/faculty/faculty.module').then(m => m.FacultyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    loadChildren: () => import('./modules/role/role.module').then(m => m.RolesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'questions',
    loadChildren: () => import('./modules/question/question.module').then(m => m.QuestionsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'answers',
    loadChildren: () => import('./modules/answer/answer.module').then(m => m.AnswersModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/' }
];
