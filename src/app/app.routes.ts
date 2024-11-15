import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';  // Importa el guard

export const routes: Routes = [
  // Redirige la ruta raíz ('/') a la página de login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Ruta de Login (no protegida)
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  // Ruta Home (protegida)
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  // Rutas protegidas (requieren autenticación)
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
  // Ruta comodín: redirige a la página home si no se encuentra la ruta solicitada
  { path: '**', redirectTo: 'home' }
];
