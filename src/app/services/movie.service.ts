import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

export interface Movie {
  id: number;
  externalId: string;
  title: string;
  description: string;
  posterUrl: string;
  availableOn: string[];
  releaseYear: number;
  releaseDate: string;
  categories: string[];
  isFavorite?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000';
  private favoritesSubject = new BehaviorSubject<Movie[]>(this.getFavorites());
  favorites$ = this.favoritesSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  searchMovies(query: string): Observable<Movie[]> {
    const encodedQuery = encodeURIComponent(query);
    return this.http.get<Movie[]>(`${this.apiUrl}/shows?title_like=${encodedQuery}`).pipe(
      map(movies => {
        const filtered = query ? 
          movies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase())) :
          movies;
          
        return filtered.map(movie => ({
          ...movie,
          isFavorite: this.isFavorite(movie.id)
        }));
      }),
      catchError(error => {
        console.error('Error searching for movies:', error);
        return of([]);
      })
    );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/shows/${id}`).pipe(
      map(movie => ({
        ...movie,
        isFavorite: this.isFavorite(movie.id)
      })),
      catchError(error => {
        console.error(`Error fetching movie with ID ${id}:`, error);
        throw error;
      })
    );
  }
  
  getFavorites(): Movie[] {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }
  
  toggleFavorite(movie: Movie): void {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(f => f.id === movie.id);
    
    movie.isFavorite = !movie.isFavorite;
    
    if (movie.isFavorite && index === -1) {
      favorites.push(movie);
    } else if (!movie.isFavorite && index !== -1) {
      favorites.splice(index, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }
  
  isFavorite(movieId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(f => f.id === movieId);
  }
  
  createMovie(movie: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/shows`, movie).pipe(
      catchError(error => {
        console.error('Error creating movie:', error);
        throw error;
      })
    );
  }
  
  updateMovie(id: number, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/shows/${id}`, movie).pipe(
      catchError(error => {
        console.error(`Error updating movie with ID ${id}:`, error);
        throw error;
      })
    );
  }
  
  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/shows/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting movie with ID ${id}:`, error);
        throw error;
      })
    );
  }
}