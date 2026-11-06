// Layer: Frontend Layer (Contact List Component)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact, PageResponse } from '../../models/contact.model';
import { ContactService } from '../../contact.service';
import { ContactFormComponent } from '../contact-form/contact-form.component';

/**
 * Standalone Angular component displaying the contact list table.
 * Features:
 * - Table view: Name, Phone, Email, City, Favorite star toggle, Actions (Edit, Delete)
 * - Server-side search filtering by name or city
 * - Server-side sorting by Name (Stretch Goal)
 * - Server-side pagination with page size options (Stretch Goal)
 * - Modal integration for Add & Edit via ContactFormComponent
 * - Confirmation dialog for safe contact deletion
 */
@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactFormComponent],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  // Contacts displayed in the table for current page
  contacts: Contact[] = [];

  // Search filter query string
  searchTerm: string = '';

  // Server-side pagination parameters
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  totalPages: number = 0;

  // Server-side sort parameters
  sortBy: string = 'name';
  sortDir: 'asc' | 'desc' = 'asc';

  // UI status flags
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Form modal visibility and state
  showFormModal: boolean = false;
  selectedContactForEdit: Contact | null = null;

  // Delete confirmation dialog state
  showDeleteModal: boolean = false;
  contactToDelete: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // Load initial list on component initialization
    this.loadContacts();
  }

  /**
   * Loads contacts from the backend using the current pagination, search, and sorting criteria.
   */
  loadContacts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.contactService.getContacts(
      this.searchTerm,
      this.page,
      this.size,
      this.sortBy,
      this.sortDir
    ).subscribe({
      next: (response: PageResponse<Contact>) => {
        this.contacts = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load contacts from server. Is the Spring Boot backend running?';
        console.error('API Error:', err);
      }
    });
  }

  /**
   * Triggered when user enters search text or clicks search button.
   * Resets page to 0 and queries backend.
   */
  onSearch(): void {
    this.page = 0;
    this.loadContacts();
  }

  /**
   * Clears the active search query.
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.page = 0;
    this.loadContacts();
  }

  /**
   * Toggles column sort order between ascending and descending (Stretch goal: sort by name).
   */
  toggleSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDir = 'asc';
    }
    this.page = 0;
    this.loadContacts();
  }

  /**
   * Navigates to the specified page index.
   */
  goToPage(targetPage: number): void {
    if (targetPage >= 0 && targetPage < this.totalPages) {
      this.page = targetPage;
      this.loadContacts();
    }
  }

  /**
   * Changes the page size (number of records per page).
   */
  onPageSizeChange(newSize: string): void {
    this.size = parseInt(newSize, 10);
    this.page = 0;
    this.loadContacts();
  }

  /**
   * Toggles the favorite star state for a specific contact.
   */
  onToggleFavorite(contact: Contact, event: Event): void {
    event.stopPropagation(); // Avoid triggering any row selection
    if (!contact.id) return;

    this.contactService.toggleFavorite(contact.id).subscribe({
      next: (updatedContact) => {
        contact.favorite = updatedContact.favorite;
        this.showTemporarySuccess(
          `${updatedContact.name} ${updatedContact.favorite ? 'marked as favorite ⭐' : 'removed from favorites'}`
        );
      },
      error: (err) => {
        this.errorMessage = 'Failed to toggle favorite status.';
        console.error('Favorite toggle error:', err);
      }
    });
  }

  /**
   * Opens the contact form modal in "Add" mode.
   */
  openAddModal(): void {
    this.selectedContactForEdit = null;
    this.showFormModal = true;
  }

  /**
   * Opens the contact form modal in "Edit" mode with pre-filled contact details.
   */
  openEditModal(contact: Contact): void {
    this.selectedContactForEdit = { ...contact };
    this.showFormModal = true;
  }

  /**
   * Closes the contact form modal.
   */
  closeFormModal(): void {
    this.showFormModal = false;
    this.selectedContactForEdit = null;
  }

  /**
   * Saves either a new contact or updates an existing one when form is submitted.
   */
  handleFormSubmit(contactData: Contact): void {
    if (contactData.id) {
      // Update existing contact
      this.contactService.updateContact(contactData.id, contactData).subscribe({
        next: (updated) => {
          this.closeFormModal();
          this.showTemporarySuccess(`Contact "${updated.name}" updated successfully!`);
          this.loadContacts();
        },
        error: (err) => {
          this.handleApiError(err);
        }
      });
    } else {
      // Create new contact
      this.contactService.createContact(contactData).subscribe({
        next: (created) => {
          this.closeFormModal();
          this.showTemporarySuccess(`Contact "${created.name}" added successfully!`);
          this.page = 0; // jump to first page to see the new contact
          this.loadContacts();
        },
        error: (err) => {
          this.handleApiError(err);
        }
      });
    }
  }

  /**
   * Prompts user with delete confirmation modal.
   */
  openDeleteModal(contact: Contact): void {
    this.contactToDelete = contact;
    this.showDeleteModal = true;
  }

  /**
   * Cancels delete confirmation.
   */
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.contactToDelete = null;
  }

  /**
   * Confirms and executes contact deletion.
   */
  executeDelete(): void {
    if (!this.contactToDelete || !this.contactToDelete.id) return;

    const contactName = this.contactToDelete.name;
    this.contactService.deleteContact(this.contactToDelete.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.showTemporarySuccess(`Contact "${contactName}" deleted successfully!`);
        // If current page is empty after deletion and not first page, go back one page
        if (this.contacts.length === 1 && this.page > 0) {
          this.page--;
        }
        this.loadContacts();
      },
      error: (err) => {
        this.closeDeleteModal();
        this.errorMessage = `Failed to delete contact: ${err.message || 'Server error'}`;
      }
    });
  }

  /**
   * Displays a temporary success toast notification.
   */
  private showTemporarySuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 4000);
  }

  /**
   * Parses backend error messages (including 400 validation error maps).
   */
  private handleApiError(err: any): void {
    if (err.error && err.error.errors) {
      const errorMap = err.error.errors;
      const details = Object.keys(errorMap).map(k => `${k}: ${errorMap[k]}`).join(', ');
      this.errorMessage = `Validation failed: ${details}`;
    } else if (err.error && err.error.message) {
      this.errorMessage = err.error.message;
    } else {
      this.errorMessage = 'An error occurred while saving the contact. Please check your data.';
    }
  }
}

