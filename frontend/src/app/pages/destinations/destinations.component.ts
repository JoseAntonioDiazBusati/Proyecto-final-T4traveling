import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Destination } from '../../services/destination.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.scss']
})
export class DestinationsComponent {
  private route = inject(ActivatedRoute);
  destinations: Destination[] = this.route.snapshot.data['destinations'] || [];
  filteredDestinations: Destination[] = [...this.destinations];
  categories: string[] = [...new Set(this.destinations.map(d => d.category))];
  selectedCategory = '';

  filterByCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filteredDestinations = cat ? this.destinations.filter(d => d.category === cat) : [...this.destinations];
  }
}

