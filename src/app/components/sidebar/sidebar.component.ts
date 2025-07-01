import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  host: {
    class:
      'fixed bottom-0 left-0 right-0 z-10  md:w-16 md:flex md:flex-col md:items-center md:justify-center md:h-screen md:top-0 md:left-0',
  },
})
export class SidebarComponent {
  constructor(public router: Router, private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
