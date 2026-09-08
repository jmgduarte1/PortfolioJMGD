import { Routes } from '@angular/router';
import { DefaultPage } from './default-page/default-page';

export const routes: Routes = [
  {
    path: '',
    component: DefaultPage,
    data: { slug: 'home' },
  },
  {
    path: ':slug',
    component: DefaultPage,
  },
  { path: '**', redirectTo: '' },
];
