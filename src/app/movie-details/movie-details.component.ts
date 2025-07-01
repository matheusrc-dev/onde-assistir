import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, Movie } from '../services/movie.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { AlertMessageComponent } from '../components/alert-message/alert-message.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    LoaderComponent,
    AlertMessageComponent,
  ],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    console.log("Route: ", this.route.params);
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (isNaN(id)) {
        this.errorMessage = 'ID de filme inválido';
        this.isLoading = false;
        return;
      }

      this.loadMovie(id);
    });
  }

  loadMovie(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.movieService.getMovieById(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (movie) => {
          this.movie = movie;
        },
        error: (error) => {
          console.error('Error fetching movie details:', error);
          this.errorMessage = 'Não foi possível carregar os detalhes do filme. Por favor, tente novamente.';
          this.movie = null;
        }
      });
  }

  toggleFavorite(): void {
    if (this.movie) {
      this.movieService.toggleFavorite(this.movie);
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  navigateToEdit(): void {
    if (this.movie) {
      this.router.navigate(['/movie', this.movie.id, 'edit']);
    }
  }
}
