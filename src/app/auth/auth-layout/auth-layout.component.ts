import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() footerText: string = '';
  @Input() footerLink: string = '';
  @Input() footerLinkText: string = '';
}
