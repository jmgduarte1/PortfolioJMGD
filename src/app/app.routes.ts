import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects-page').then((m) => m.ProjectsPage),
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/experience/experience-page').then((m) => m.ExperiencePage),
  },
  {
    path: 'certifications',
    loadComponent: () => import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { page: 'certifications' },
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { page: 'skills' },
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    data: { focusContact: true },
  },
  {
    path: 'accessibility',
    loadComponent: () => import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { page: 'accessibility' },
  },
  { path: '**', redirectTo: '' },
];
