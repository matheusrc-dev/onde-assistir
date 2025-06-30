import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from '../components/movie-card/movie-card.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { AlertMessageComponent } from '../components/alert-message/alert-message.component';
import { MovieService, Movie } from '../services/movie.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MovieCardComponent,
    SidebarComponent,
    LoaderComponent,
    AlertMessageComponent,
  ],
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  movies: Movie[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.searchMovies();
      }
    });
  }

  searchMovies(): void {
    this.isLoading = true;
    this.errorMessage = '';

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
          this.errorMessage =
            'Ocorreu um erro ao buscar filmes. Por favor, tente novamente.';
          this.movies = [];
        },
      });
  }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Por favor, digite um termo de busca';
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchQuery },
      queryParamsHandling: 'merge',
    });

    this.searchMovies();
  }

  toggleFavorite(movie: any): void {
    this.movieService.toggleFavorite(movie);
  }
}
