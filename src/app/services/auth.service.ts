import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {}

  login(email: string, password: string): { success: boolean, error?: string } {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('authToken', `token-${Date.now()}-${email}`);
      localStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }));
      this.isLoggedInSubject.next(true);
      return { success: true };
    }
    return { success: false, error: 'invalidCredentials' };
  }

  register(user: any): { success: boolean, error?: string } {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: any) => u.email === user.email);
    
    if (userExists) {
      return { success: false, error: 'emailTaken' };
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true };
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  hasValidToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }
}
