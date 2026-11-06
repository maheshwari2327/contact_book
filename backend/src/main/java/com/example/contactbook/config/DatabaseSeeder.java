// Layer: Database & Persistence Layer (Data Initializer / Seeder)
package com.example.contactbook.config;

import com.example.contactbook.model.Contact;
import com.example.contactbook.repository.ContactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Seeds the database with initial sample records on first run if the table is empty.
 * Implements CommandLineRunner so it executes right after the Spring context is initialized.
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final ContactRepository contactRepository;

    // Dependency injection via constructor
    public DatabaseSeeder(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        // Only seed if the database does not have any records yet
        if (contactRepository.count() == 0) {
            log.info("Contact table is empty. Seeding 5 initial sample contacts...");

            List<Contact> initialContacts = Arrays.asList(
                new Contact("Alice Johnson", "9876543210", "alice.johnson@example.com", "Seattle", true),
                new Contact("Bob Smith", "8765432109", "bob.smith@example.com", "San Francisco", false),
                new Contact("Charlie Davis", "7654321098", "charlie.davis@example.com", "New York", true),
                new Contact("Diana Prince", "6543210987", "diana.prince@example.com", "Austin", false),
                new Contact("Ethan Hunt", "5432109876", "ethan.hunt@example.com", "Chicago", true)
            );

            contactRepository.saveAll(initialContacts);
            log.info("Database successfully seeded with {} sample contacts.", initialContacts.size());
        } else {
            log.info("Database already contains {} contacts. Skipping initial seeding.", contactRepository.count());
        }
    }
}

