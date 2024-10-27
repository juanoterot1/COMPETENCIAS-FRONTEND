// src/app/app-routing.module.ts (O en el archivo de rutas principal que mencionaste)
import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/user.module').then(m => m.UserModule)
  },
  {
    path: 'faculty',
    loadChildren: () => import('./modules/faculty/faculty.module').then(m => m.FacultyModule)
  },
  {
    path: 'subjects',
    loadChildren: () => import('./modules/subjects/subject.module').then(m => m.SubjectModule)
  },
  {
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
