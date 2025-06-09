import { Component, ViewChild } from '@angular/core';
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
  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.hasValidToken()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin(formData: any) {
    const result = this.authService.login(formData.email, formData.password);
    
    if (result.success) {
      this.router.navigate(['/home']);
    } else if (result.error === 'invalidCredentials') {
      this.authFormComponent.authForm.setErrors({ invalidCredentials: true });
    }
  }
}