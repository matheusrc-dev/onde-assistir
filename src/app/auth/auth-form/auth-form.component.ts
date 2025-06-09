import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent implements OnInit {
  @Input() isRegister: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();

  authForm!: FormGroup;
  submitted = false;

  private namePattern = /^[a-zA-ZÀ-ÿ\s']+$/;
  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    if (this.isRegister) {
      this.authForm = new FormGroup({
        firstName: new FormControl('', [
          Validators.required,
          Validators.pattern(this.namePattern),
          Validators.minLength(2),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.pattern(this.namePattern),
          Validators.minLength(2),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(this.emailPattern),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(this.passwordPattern),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      }, { validators: this.passwordMatchValidator });
    } else {
      this.authForm = new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(this.emailPattern),
        ]),
        password: new FormControl('', [Validators.required]),
      });
    }
  }

  // Validador personalizado para verificar se as senhas coincidem
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  };

  onSubmit() {
    this.submitted = true;

    if (this.authForm.valid) {
      this.formSubmit.emit(this.authForm.value);
    }
  }

  // Métodos auxiliares para acessar e verificar erros nos templates
  getFieldControl(field: string) {
    return this.authForm.get(field);
  }

  hasError(field: string, error: string) {
    const control = this.getFieldControl(field);
    return control?.errors?.[error] && (control?.touched || this.submitted);
  }

  isFieldInvalid(field: string) {
    const control = this.getFieldControl(field);
    return control?.invalid && (control?.touched || this.submitted);
  }
}
