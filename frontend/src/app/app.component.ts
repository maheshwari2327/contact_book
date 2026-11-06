// Layer: Frontend Layer (Root Application Component)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './components/contact-list/contact-list.component';

/**
 * Root component that serves as the layout shell of the Contact Book single-page application.
 * Hosts the header, global branding, and the main ContactListComponent.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ContactListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Contact Book';
}

