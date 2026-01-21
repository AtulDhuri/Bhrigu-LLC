import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/blog/post-list/post-list.component').then(m => m.PostListComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./features/blog/post-detail/post-detail.component').then(m => m.PostDetailComponent)
  },
  {
    path: 'posts/:id/add-comment',
    loadComponent: () => import('./features/blog/add-comment/add-comment.component').then(m => m.AddCommentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'albums',
    loadComponent: () => import('./features/photos/album-list/album-list.component').then(m => m.AlbumListComponent)
  },
  {
    path: 'albums/:id',
    loadComponent: () => import('./features/photos/album-detail/album-detail.component').then(m => m.AlbumDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
