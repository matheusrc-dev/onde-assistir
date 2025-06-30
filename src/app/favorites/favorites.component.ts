import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../components/movie-card/movie-card.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SidebarComponent],
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.favorites = this.movieService.getFavorites();

    this.movieService.favorites$.subscribe((favorites) => {
      this.favorites = favorites;
    });
  }

  toggleFavorite(movie: any): void {
    this.movieService.toggleFavorite(movie);
  }
}
