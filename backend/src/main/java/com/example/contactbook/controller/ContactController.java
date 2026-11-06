// Layer: Backend API Layer (REST Controller)
package com.example.contactbook.controller;

import com.example.contactbook.exception.ResourceNotFoundException;
import com.example.contactbook.model.Contact;
import com.example.contactbook.repository.ContactRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing the endpoints for managing Contacts.
 * Base URL path: /api/contacts
 * Configured with CORS for Angular frontend running on http://localhost:4200.
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactRepository contactRepository;

    // Dependency injection of ContactRepository via constructor
    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * GET /api/contacts?q={searchQuery}&page={page}&size={size}&sortBy={sortBy}&sortDir={sortDir}
     * Searches contacts by name or city (case-insensitive).
     * If 'page' is provided, returns a paginated Page<Contact> response (Stretch Goal).
     * If 'page' is omitted, returns the full List<Contact> matching the query.
     *
     * @param q Optional search string for name or city
     * @param page Zero-based page index (optional)
     * @param size Page size (optional)
     * @param sortBy Column to sort by, default is "name"
     * @param sortDir Sort direction ("asc" or "desc"), default is "asc"
     * @return 200 OK with either Page<Contact> or List<Contact>
     */
    @GetMapping
    public ResponseEntity<?> getContacts(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir) {

        // Validate and configure sorting direction
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);

        boolean hasSearchTerm = (q != null && !q.trim().isEmpty());
        String searchTerm = hasSearchTerm ? q.trim() : "";

        // Server-side pagination mode when 'page' query parameter is present
        if (page != null) {
            int pageSize = (size != null && size > 0) ? size : 10;
            Pageable pageable = PageRequest.of(page, pageSize, sort);

            Page<Contact> contactPage;
            if (hasSearchTerm) {
                contactPage = contactRepository.searchByNameOrCity(searchTerm, pageable);
            } else {
                contactPage = contactRepository.findAll(pageable);
            }
            return ResponseEntity.ok(contactPage);
        }

        // Standard unpaginated list mode
        List<Contact> contacts;
        if (hasSearchTerm) {
            contacts = contactRepository.searchByNameOrCityList(searchTerm);
        } else {
            contacts = contactRepository.findAll(sort);
        }
        return ResponseEntity.ok(contacts);
    }

    /**
     * GET /api/contacts/{id}
     * Retrieves a single contact by primary key ID.
     *
     * @param id The contact ID
     * @return 200 OK with Contact entity, or 404 Not Found if contact does not exist
     */
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        // Fetch contact or throw custom ResourceNotFoundException (handled by GlobalExceptionHandler -> 404)
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        return ResponseEntity.ok(contact);
    }

    /**
     * POST /api/contacts
     * Creates a new contact after validating request body annotations (@NotBlank, @Email, @Pattern).
     *
     * @param contact The contact payload from frontend
     * @return 201 Created with the saved Contact entity
     */
    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody Contact contact) {
        // Ensure new entity has no existing ID so Hibernate generates a fresh row
        contact.setId(null);

        Contact savedContact = contactRepository.save(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedContact);
    }

    /**
     * PUT /api/contacts/{id}
     * Updates an existing contact by ID.
     *
     * @param id The ID of the contact to update
     * @param contactDetails The updated contact data
     * @return 200 OK with updated Contact, or 404 Not Found if id does not exist
     */
    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable Long id, @Valid @RequestBody Contact contactDetails) {
        // Find existing contact or throw 404
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        // Update properties
        existingContact.setName(contactDetails.getName());
        existingContact.setPhone(contactDetails.getPhone());
        existingContact.setEmail(contactDetails.getEmail());
        existingContact.setCity(contactDetails.getCity());
        existingContact.setFavorite(contactDetails.isFavorite());

        // Save updated entity to MySQL
        Contact updatedContact = contactRepository.save(existingContact);
        return ResponseEntity.ok(updatedContact);
    }

    /**
     * DELETE /api/contacts/{id}
     * Deletes a contact by ID.
     *
     * @param id The ID of the contact to delete
     * @return 200 OK with confirmation message, or 404 Not Found if id does not exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteContact(@PathVariable Long id) {
        // Verify contact exists before attempting deletion
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        contactRepository.delete(existingContact);

        Map<String, Object> response = new HashMap<>();
        response.put("deleted", true);
        response.put("message", "Contact deleted successfully with id: " + id);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/contacts/{id}/favorite
     * Convenience endpoint to quickly toggle a contact's favorite status.
     *
     * @param id The contact ID
     * @return 200 OK with updated contact, or 404 Not Found
     */
    @PatchMapping("/{id}/favorite")
    public ResponseEntity<Contact> toggleFavorite(@PathVariable Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        // Invert boolean state
        contact.setFavorite(!contact.isFavorite());
        Contact updatedContact = contactRepository.save(contact);

        return ResponseEntity.ok(updatedContact);
    }
}

