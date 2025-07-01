import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { 
    path: 'movie', 
    canActivate: [authGuard],
    children: [
      { 
        path: 'new', 
        loadComponent: () => import('./movie-form/movie-form.component').then(m => m.MovieFormComponent) 
      },
      { 
        path: ':id', 
        loadComponent: () => import('./movie-details/movie-details.component').then(m => m.MovieDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./movie-form/movie-form.component').then(m => m.MovieFormComponent)
      }
    ]
  }
];