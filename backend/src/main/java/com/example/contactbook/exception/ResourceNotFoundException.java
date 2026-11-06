// Layer: Backend API Layer (Custom Exception)
package com.example.contactbook.exception;

/**
 * Custom runtime exception thrown when a requested contact is not found by ID.
 * Maps cleanly to HTTP 404 Not Found via GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

