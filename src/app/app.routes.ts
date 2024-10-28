// src/app/app-routing.module.ts (O en el archivo de rutas principal que mencionaste)
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
    loadChildren: () => import('./modules/users/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'faculty',
    loadChildren: () => import('./modules/faculty/faculty.module').then(m => m.FacultyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'subjects',
    loadChildren: () => import('./modules/subjects/subject.module').then(m => m.SubjectModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'evaluations',
    loadChildren: () => import('./modules/evaluations/evaluation.module').then(m => m.EvaluationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'questions',
    loadChildren: () => import('./modules/questions/question.module').then(m => m.QuestionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'answers',
    loadChildren: () => import('./modules/answers/answer.module').then(m => m.AnswerModule),
    canActivate: [AuthGuard]
  },
  /* {
    path: 'evaluations',
    loadChildren: () => import('./modules/evaluations/evaluation.module').then(m => m.EvaluationModule)
  },
  {
    path: 'questions',
    loadChildren: () => import('./modules/questions/question.module').then(m => m.QuestionModule)
  },
  {
    path: 'answers',
    loadChildren: () => import('./modules/answers/answer.module').then(m => m.AnswerModule)
  }, */
  { path: '**', redirectTo: '/' }
];
