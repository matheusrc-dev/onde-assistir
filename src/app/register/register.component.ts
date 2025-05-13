import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../auth/auth-layout/auth-layout.component';
import { AuthFormComponent } from '../auth/auth-form/auth-form.component';

@Component({
  selector: 'app-register',
  imports: [AuthLayoutComponent, AuthFormComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  onRegister(formData: any) {
    console.log('Register...', formData);
  }
}
