import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Output() favoriteClicked = new EventEmitter<void>();

  constructor(private movieService: MovieService) {}

  onFavoriteClick() {
    this.favoriteClicked.emit();
  }
}
