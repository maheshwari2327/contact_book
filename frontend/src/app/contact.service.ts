// Layer: Frontend Layer (HTTP Service - API Client)
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, PageResponse } from './models/contact.model';

/**
 * Service responsible for all HTTP communication with the Spring Boot backend API.
 * Uses Angular's HttpClient to perform CRUD operations, search, pagination, and favorites.
 */
@Injectable({
  providedIn: 'root'
})
export class ContactService {

  // Base URL pointing to the Spring Boot REST API
  private readonly apiUrl = 'http://localhost:8080/api/contacts';

  // Inject Angular's modern HttpClient
  constructor(private http: HttpClient) {}

  /**
   * Fetches paginated & sorted contacts with optional search query.
   * Connects to GET /api/contacts?q=...&page=...&size=...&sortBy=...&sortDir=...
   *
   * @param query Search string for filtering name or city
   * @param page Zero-based page number (defaults to 0)
   * @param size Number of items per page (defaults to 10)
   * @param sortBy Column to sort by (defaults to 'name')
   * @param sortDir Sort order 'asc' or 'desc' (defaults to 'asc')
   */
  getContacts(
    query: string = '',
    page: number = 0,
    size: number = 10,
    sortBy: string = 'name',
    sortDir: string = 'asc'
  ): Observable<PageResponse<Contact>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (query && query.trim() !== '') {
      params = params.set('q', query.trim());
    }

    return this.http.get<PageResponse<Contact>>(this.apiUrl, { params });
  }

  /**
   * Fetches all contacts without pagination (standard list mode).
   * Connects to GET /api/contacts?q=...
   */
  getAllContacts(query: string = ''): Observable<Contact[]> {
    let params = new HttpParams();
    if (query && query.trim() !== '') {
      params = params.set('q', query.trim());
    }
    return this.http.get<Contact[]>(this.apiUrl, { params });
  }

  /**
   * Fetches a single contact by its unique ID.
   * Connects to GET /api/contacts/{id}
   */
  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new contact.
   * Connects to POST /api/contacts
   */
  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  /**
   * Updates an existing contact by ID.
   * Connects to PUT /api/contacts/{id}
   */
  updateContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  /**
   * Deletes a contact by ID.
   * Connects to DELETE /api/contacts/{id}
   */
  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Toggles the favorite status for a contact.
   * Connects to PATCH /api/contacts/{id}/favorite
   */
  toggleFavorite(id: number): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${id}/favorite`, {});
  }
}

