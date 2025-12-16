import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() imageSrc?: string;
  @Input() imageAlt?: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() horizontal: boolean = false;
  @Input() hoverable: boolean = true;

  get cardClasses(): string {
    return `card ${this.horizontal ? 'card--horizontal' : ''} ${this.hoverable ? 'card--hoverable' : ''}`.trim();
  }
}

