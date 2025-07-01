import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { MovieService, Movie } from '../services/movie.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { AlertMessageComponent } from '../components/alert-message/alert-message.component';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    SidebarComponent, 
    LoaderComponent,
    AlertMessageComponent
  ],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css'
})
export class MovieFormComponent implements OnInit {
  movieForm!: FormGroup;
  isEdit = false;
  movieId?: number;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  platforms = ['Netflix', 'Prime Video', 'Disney+', 'Max', 'Apple TV+', 'Globoplay', 'Paramount+'];
  categories = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção científica', 'Terror', 'Romance', 'Animação', 'Documentário'];
  
  get currentYear(): number {
    return new Date().getFullYear();
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.pipe(
      tap(params => {
        const id = params.get('id');
        if (id) {
          this.isEdit = true;
          this.movieId = +id;
          this.loadMovieData(+id);
        }
      })
    ).subscribe();
  }

  initForm(): void {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      posterUrl: ['', [Validators.required]],
      releaseYear: [null, [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
      releaseDate: ['', [Validators.required]],
      availableOn: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      categories: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  loadMovieData(id: number): void {
    this.isLoading = true;
    
    this.movieService.getMovieById(id)
      .pipe(
        tap(movie => {
          this.getAvailableOnArray().clear();
          this.getCategoriesArray().clear();
          
          this.movieForm.patchValue({
            title: movie.title,
            description: movie.description,
            posterUrl: movie.posterUrl,
            releaseYear: movie.releaseYear,
            releaseDate: movie.releaseDate
          });
          
          movie.availableOn.forEach(platform => {
            this.addAvailablePlatform(platform);
          });
          
          movie.categories.forEach(category => {
            this.addCategory(category);
          });
          
          this.isLoading = false;
        }),
        catchError(error => {
          console.error('Error loading movie data:', error);
          this.errorMessage = 'Não foi possível carregar os dados do filme. Por favor, tente novamente.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe();
  }

  getAvailableOnArray(): FormArray {
    return this.movieForm.get('availableOn') as FormArray;
  }
  
  getCategoriesArray(): FormArray {
    return this.movieForm.get('categories') as FormArray;
  }
  
  togglePlatform(platform: string): void {
    const availableOnArray = this.getAvailableOnArray();
    const index = availableOnArray.value.indexOf(platform);
    
    if (index === -1) {
      availableOnArray.push(this.fb.control(platform));
    } else {
      availableOnArray.removeAt(index);
    }
  }
  
  isPlatformSelected(platform: string): boolean {
    return this.getAvailableOnArray().value.includes(platform);
  }
  
  toggleCategory(category: string): void {
    const categoriesArray = this.getCategoriesArray();
    const index = categoriesArray.value.indexOf(category);
    
    if (index === -1) {
      categoriesArray.push(this.fb.control(category));
    } else {
      categoriesArray.removeAt(index);
    }
  }
  
  isCategorySelected(category: string): boolean {
    return this.getCategoriesArray().value.includes(category);
  }
  
  addAvailablePlatform(platform: string): void {
    this.getAvailableOnArray().push(this.fb.control(platform));
  }
  
  addCategory(category: string): void {
    this.getCategoriesArray().push(this.fb.control(category));
  }
  
  onSubmit(): void {
    if (this.movieForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const movieData: Partial<Movie> = {
      ...this.movieForm.value,
      externalId: this.isEdit && this.movieId ? `movie-${this.movieId}` : `movie-${Date.now()}`,
      id: this.isEdit && this.movieId ? this.movieId : undefined
    };
    
    let action$: Observable<any>;
    
    if (this.isEdit && this.movieId) {
      action$ = this.movieService.updateMovie(this.movieId, movieData);
    } else {
      action$ = this.movieService.createMovie(movieData);
    }
    
    action$.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = this.isEdit ? 'Filme atualizado com sucesso!' : 'Filme cadastrado com sucesso!';
        
        setTimeout(() => {
          this.router.navigate(['/movie', this.isEdit ? this.movieId : response.id]);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error saving movie:', error);
        this.errorMessage = this.isEdit 
          ? 'Erro ao atualizar o filme. Por favor, tente novamente.' 
          : 'Erro ao cadastrar o filme. Por favor, tente novamente.';
      }
    });
  }
  
  cancelForm(): void {
    if (this.isEdit && this.movieId) {
      this.router.navigate(['/movie', this.movieId]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
