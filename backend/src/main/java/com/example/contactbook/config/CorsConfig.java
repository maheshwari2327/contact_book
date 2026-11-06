// Layer: Backend API Layer (CORS Configuration)
package com.example.contactbook.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global Cross-Origin Resource Sharing (CORS) configuration.
 * Enables the Angular frontend running at http://localhost:4200 to communicate
 * securely with the Spring Boot backend REST endpoints.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Apply CORS rules to all endpoints under /api/**
        registry.addMapping("/api/**")
                // Allowed frontend origin
                .allowedOrigins("http://localhost:4200")
                // Allowed HTTP methods for complete CRUD operations
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                // Allowed request headers (Authorization, Content-Type, etc.)
                .allowedHeaders("*")
                // Allow credentials (cookies/auth headers if needed in the future)
                .allowCredentials(true)
                // Cache pre-flight response for 1 hour (3600 seconds)
                .maxAge(3600);
    }
}

