// Layer: Frontend Layer (TypeScript Data Models & Interfaces)

/**
 * Interface representing a Contact entity on the frontend.
 * Mirrors the Spring Boot backend Contact.java entity.
 */
export interface Contact {
  // Unique database identifier, optional when creating a new contact
  id?: number;

  // Contact's full name (required, min length 2)
  name: string;

  // Contact's phone number (must be 10 digits)
  phone: string;

  // Contact's email address (valid email format)
  email: string;

  // Contact's city of residence
  city: string;

  // Starred / favorite toggle status
  favorite: boolean;
}

/**
 * Interface representing Spring Boot's Page<T> response object.
 * Used for server-side pagination and sorting (Stretch Goal).
 */
export interface PageResponse<T> {
  // Array of records for the current page
  content: T[];

  // Total number of records across all pages
  totalElements: number;

  // Total count of pages
  totalPages: number;

  // Page size (number of items requested per page)
  size: number;

  // Current zero-indexed page number
  number: number;

  // Flag indicating if this is the first page
  first: boolean;

  // Flag indicating if this is the last page
  last: boolean;

  // Flag indicating if current page has zero items
  empty: boolean;
}

