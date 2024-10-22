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
  path: 'relations',
  loadChildren: () => import('./modules/relations/relation.module').then(m => m.RelationsModule),
  },

  { path: '**', redirectTo: '/' }
];
