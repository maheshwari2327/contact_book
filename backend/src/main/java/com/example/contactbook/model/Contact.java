// Layer: Database & Persistence Layer (JPA Entity / Data Model)
package com.example.contactbook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Entity representing a Contact record mapped to the 'contacts' table in MySQL.
 */
@Entity
@Table(name = "contacts")
public class Contact {

    // Primary key with auto-increment generation strategy in MySQL
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Contact's full name: mandatory field
    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 100)
    private String name;

    // Contact's phone number: must be exactly 10 digits
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits (digits only)")
    @Column(nullable = false, length = 15)
    private String phone;

    // Contact's email address: must be in valid email format
    @NotBlank(message = "Email is required")
    @Email(message = "Must provide a valid email address (e.g., user@example.com)")
    @Column(nullable = false, length = 100)
    private String email;

    // Contact's residential city: mandatory field
    @NotBlank(message = "City is required")
    @Column(nullable = false, length = 50)
    private String city;

    // Toggle indicating if contact is starred as a favorite
    @Column(nullable = false)
    private boolean favorite = false;

    // Default no-argument constructor required by JPA/Hibernate
    public Contact() {
    }

    // Convenience parameterized constructor for testing and seeding
    public Contact(String name, String phone, String email, String city, boolean favorite) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.city = city;
        this.favorite = favorite;
    }

    // --- Getters and Setters with explanatory comments ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", city='" + city + '\'' +
                ", favorite=" + favorite +
                '}';
    }
}

