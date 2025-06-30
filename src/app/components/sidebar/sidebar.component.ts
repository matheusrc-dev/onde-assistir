import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  host: {
    '[class]': 'isMobile ? "fixed bottom-0 left-0 right-0 z-10" : "w-16 flex flex-col items-center justify-center fixed h-screen top-0 left-0"',
  },
})
export class SidebarComponent {
  isMobile: boolean = false;

  constructor(public router: Router) {
    // Verificar tamanho da tela no início
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768; // 768px é um breakpoint comum para tablets/dispositivos móveis
  }
}
