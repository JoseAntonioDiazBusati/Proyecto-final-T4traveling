import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationFormComponent } from './registration-form.component';
import { BookingFormComponent } from './booking-form.component';
import { ContactFormComponent } from './contact-form.component';

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  imports: [
    CommonModule,
    RegistrationFormComponent,
    BookingFormComponent,
    ContactFormComponent
  ],
  templateUrl: './forms-demo.component.html',
  styleUrls: ['./forms-demo.component.scss']
})
export class FormsDemoComponent {
  activeTab: 'registration' | 'booking' | 'contact' = 'registration';

  selectTab(tab: 'registration' | 'booking' | 'contact'): void {
    this.activeTab = tab;
  }
}

