import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Output() favoriteClicked = new EventEmitter<void>();

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  onFavoriteClick(event: Event) {
    event.stopPropagation();
    this.favoriteClicked.emit();
  }

  navigateToDetails() {
    this.router.navigate(['/movie', this.movie.id]);
  }
}
