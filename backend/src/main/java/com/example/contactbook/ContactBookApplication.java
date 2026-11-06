// Layer: Backend Application Entry Point (Spring Boot Main Class)
package com.example.contactbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class that bootstraps and starts the Spring Boot backend server.
 */
@SpringBootApplication
public class ContactBookApplication {

    public static void main(String[] args) {
        // Starts the embedded Tomcat server on port 8080 and initializes Spring context
        SpringApplication.run(ContactBookApplication.class, args);
    }
}

