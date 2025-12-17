import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/interactive-demo',
    pathMatch: 'full'
  },
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide.component').then(m => m.StyleGuideComponent)
  },
  {
    path: 'interactive-demo',
    loadComponent: () => import('./pages/interactive-demo/interactive-demo.component').then(m => m.InteractiveDemoComponent)
  }
];

