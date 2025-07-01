import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { AlertMessageComponent } from '../components/alert-message/alert-message.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { MovieCardComponent } from '../components/movie-card/movie-card.component';
import { MovieService, Movie } from '../services/movie.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SidebarComponent,
    AlertMessageComponent,
    LoaderComponent,
    MovieCardComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  currentUser: any = null;
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  movies: Movie[] = [];
  hasSearched: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Por favor, digite um termo de busca';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.hasSearched = true;
    
    this.searchMovies();
  }
  
  searchMovies(): void {
    this.movieService
      .searchMovies(this.searchQuery)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (movies) => {
          this.movies = movies;
        },
        error: (error) => {
          console.error('Error fetching movies:', error);
          this.errorMessage = 'Ocorreu um erro ao buscar filmes. Por favor, tente novamente.';
          this.movies = [];
        }
      });
  }
  
  toggleFavorite(movie: Movie): void {
    this.movieService.toggleFavorite(movie);
  }

  navigateToCreateMovie(): void {
    this.router.navigate(['/movie/new']);
  }

  logout(): void {
    this.authService.logout();
  }
}
