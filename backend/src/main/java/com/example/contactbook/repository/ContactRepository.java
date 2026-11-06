// Layer: Database & Persistence Layer (Spring Data JPA Repository)
package com.example.contactbook.repository;

import com.example.contactbook.model.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the Contact entity.
 * Provides out-of-the-box CRUD methods and custom queries for searching.
 */
@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    /**
     * Search contacts whose name or city contains the given search query string (case-insensitive).
     * Supports server-side pagination and sorting via Pageable.
     *
     * @param query Search keyword to look for in name or city
     * @param pageable Pagination and sorting specifications (page, size, sort)
     * @return Page of matching Contact records
     */
    @Query("SELECT c FROM Contact c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Contact> searchByNameOrCity(@Param("query") String query, Pageable pageable);

    /**
     * Search contacts returning an unpaginated List (useful for quick lookups).
     */
    @Query("SELECT c FROM Contact c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Contact> searchByNameOrCityList(@Param("query") String query);
}

