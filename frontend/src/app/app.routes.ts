import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/style-guide',
    pathMatch: 'full'
  },
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide.component').then(m => m.StyleGuideComponent)
  }
];

