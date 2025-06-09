import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from '../auth/auth-layout/auth-layout.component';
import { AuthFormComponent } from '../auth/auth-form/auth-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AuthLayoutComponent, AuthFormComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Redirecionar para home se já estiver autenticado
    if (this.authService.hasValidToken()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin(formData: any) {
    const success = this.authService.login(formData.email, formData.password);
    
    if (success) {
      this.router.navigate(['/home']);
    }
  }
}