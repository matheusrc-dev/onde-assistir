import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../auth/auth-layout/auth-layout.component';
import { AuthFormComponent } from '../auth/auth-form/auth-form.component';

@Component({
  selector: 'app-login',
  imports: [AuthLayoutComponent, AuthFormComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  onLogin(formData: any) {
    console.log('Login...', formData);
  }
}
