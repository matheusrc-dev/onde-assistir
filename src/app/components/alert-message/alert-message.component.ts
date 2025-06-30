import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-message.component.html'
})
export class AlertMessageComponent {
  @Input() message: string = '';
  @Input() type: 'error' | 'warning' | 'success' | 'info' = 'info';
}
