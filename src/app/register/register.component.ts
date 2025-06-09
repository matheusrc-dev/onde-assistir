import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from '../auth/auth-layout/auth-layout.component';
import { AuthFormComponent } from '../auth/auth-form/auth-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, AuthLayoutComponent, AuthFormComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onRegister(formData: any) {
    const newUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    };
    
    const success = this.authService.register(newUser);
    
    if (success) {
      // Redirecionar para login após cadastro
      this.router.navigate(['/login']);
    }
  }
}
