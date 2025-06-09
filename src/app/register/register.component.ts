import { Component, ViewChild } from '@angular/core';
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
  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

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
    
    const result = this.authService.register(newUser);
    
    if (result.success) {
      this.router.navigate(['/login']);
    } else if (result.error === 'emailTaken') {
      this.authFormComponent.authForm.get('email')?.setErrors({ emailTaken: true });
    }
  }
}
