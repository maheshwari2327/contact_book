# 📇 Contact Book Application

A clean, beginner-friendly, full-stack Contact Book application built with **Angular (standalone components)**, **Spring Boot 3**, and **MySQL 8**.

---

## 🏗️ 3-Tier Architecture Overview

The application is structured into three clearly separated architectural layers. Every source file contains a header comment identifying its exact layer:

```
┌────────────────────────────────────────────────────────┐
│  1. Frontend Layer (Angular 18+ Standalone App)         │
│     - URL: http://localhost:4200                        │
│     - Components: ContactList, ContactForm              │
│     - Services: ContactService (HttpClient)            │
│     - Reactive Forms with real-time validation          │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST (JSON)
                           │ CORS: http://localhost:4200
┌──────────────────────────▼─────────────────────────────┐
│  2. Backend API Layer (Spring Boot 3 / Java 17+)       │
│     - URL: http://localhost:8080/api/contacts           │
│     - Controller: ContactController                     │
│     - Exception Handling: GlobalExceptionHandler        │
│     - HTTP Status Codes: 200, 201, 400, 404             │
└──────────────────────────┬─────────────────────────────┘
                           │ JPA / Hibernate ORM
                           │ spring.jpa.hibernate.ddl-auto=update
┌──────────────────────────▼─────────────────────────────┐
│  3. Database & Persistence Layer (MySQL 8)             │
│     - URL: localhost:3306/contacts                     │
│     - Entity: Contact.java (id, name, phone, etc.)      │
│     - Repository: ContactRepository (Spring Data JPA)   │
│     - Seeder: DatabaseSeeder (3-5 sample records)       │
└────────────────────────────────────────────────────────┘
```

---

## ✨ Features

1. **Contact List Table**: Displays Name, Phone, Email, City, Favorite star, and Actions (Edit, Delete).
2. **Add & Edit Reactive Form**:
   - Name: Required, minimum 2 characters.
   - Phone: Required, exactly 10 digits (`^[0-9]{10}$`).
   - Email: Required, valid email format.
   - City: Required.
   - Real-time client-side feedback and server-side validation error handling.
3. **Delete Contact**: Confirmation dialog prevents accidental deletions.
4. **Search Filter**: Search instantly across both **name** and **city** (`?q=`).
5. **Favorite Star**: One-click toggle (⭐ / ☆) to bookmark important contacts with visual badge highlights.
6. **Stretch Goal — Server-Side Pagination & Sorting**:
   - Sort contacts by **Name** (ascending/descending) with clickable table headers.
   - Paginate results with configurable page sizes (5, 10, 20 items per page) and previous/next page controls.

---

## 📁 Folder Structure

```
contact_book/
├── backend/                                # Spring Boot 3 Maven Project
│   ├── pom.xml                             # Dependencies: Web, Data JPA, Validation, MySQL
│   ├── .mvn/wrapper/                       # Maven wrapper configuration
│   └── src/main/
│       ├── java/com/example/contactbook/
│       │   ├── ContactBookApplication.java # Spring Boot entry point
│       │   ├── config/
│       │   │   ├── CorsConfig.java         # Global CORS for http://localhost:4200
│       │   │   └── DatabaseSeeder.java     # Seeds 5 sample contacts on first run
│       │   ├── controller/
│       │   │   └── ContactController.java  # REST API endpoints (GET, POST, PUT, DELETE)
│       │   ├── exception/
│       │   │   ├── GlobalExceptionHandler.java # Maps errors to 400, 404, 500
│       │   │   └── ResourceNotFoundException.java
│       │   ├── model/
│       │   │   └── Contact.java            # JPA Entity & validation annotations
│       │   └── repository/
│       │       └── ContactRepository.java  # Spring Data JPA Repository
│       └── resources/
│           └── application.properties      # MySQL connection & Hibernate ddl-auto
├── frontend/                               # Angular Standalone Project
│   ├── angular.json                        # Angular CLI build settings
│   ├── package.json                        # Pinned dependencies (Angular 18, RxJS)
│   ├── tsconfig.json                       # TypeScript compiler configuration
│   └── src/
│       ├── index.html                      # HTML host page
│       ├── main.ts                         # Bootstrap standalone application
│       ├── styles.css                      # Global styles & design system
│       └── app/
│           ├── app.component.ts            # Root layout shell
│           ├── app.component.html
│           ├── app.component.css
│           ├── app.config.ts               # provideHttpClient registration
│           ├── contact.service.ts          # Angular HttpClient service for API calls
│           ├── models/
│           │   └── contact.model.ts        # Contact & PageResponse TypeScript interfaces
│           ├── components/
│           │   ├── contact-form/           # Reactive Form Component (Add/Edit)
│           │   │   ├── contact-form.component.ts
│           │   │   ├── contact-form.component.html
│           │   │   └── contact-form.component.css
│           │   └── contact-list/           # Contact List Table & Search Component
│           │       ├── contact-list.component.ts
│           │       ├── contact-list.component.html
│           │       └── contact-list.component.css
└── README.md                               # Project documentation
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your laptop:
- **Java**: JDK 17 or higher (`java -version`)
- **Maven**: 3.8+ (`mvn -v`)
- **Node.js**: v18.x or v20+ or v22+ (`node -v`)
- **npm**: 9.x or 10.x (`npm -v`)
- **MySQL 8**: Local MySQL service OR Docker

---

## 🗄️ Step 1: Database Setup (MySQL 8)

### Option A: Using Docker (Recommended — fast and clean)
Run the following single command in your terminal:
```bash
docker run --name mysql-contacts -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=contacts -p 3306:3306 -d mysql:8
```

### Option B: Local MySQL Installation
If you already have MySQL installed locally:
1. Log in to MySQL CLI or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS contacts;
   ```
3. If your MySQL password is not `root`, update `spring.datasource.password` in:
   `contact_book/backend/src/main/resources/application.properties`

### 💡 Why `spring.jpa.hibernate.ddl-auto=update`?
In `application.properties`, we configure:
```properties
spring.jpa.hibernate.ddl-auto=update
```
- **Automatic Schema Generation**: When the Spring Boot application boots up, Hibernate inspects the `Contact.java` class (`@Entity`, `@Column`, `@Id`, etc.).
- If the `contacts` table does not exist in MySQL, Hibernate automatically executes the `CREATE TABLE contacts (...)` DDL command.
- If you add or modify fields later, Hibernate executes `ALTER TABLE` to add the new columns **without destroying or dropping your existing contact data**.
- This makes setup effortless: **you do not need to run manual SQL creation scripts**.

---

## 🚀 Step 2: Run the Backend (Spring Boot 3)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd contact_book/backend
   ```
2. Build and start the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```
3. When the server finishes starting, you will see:
   ```
   Tomcat started on port 8080 (http) with context path '/'
   Database successfully seeded with 5 sample contacts.
   ```
4. Verify the backend is running by opening:
   [http://localhost:8080/api/contacts](http://localhost:8080/api/contacts)

---

## 🎨 Step 3: Run the Frontend (Angular)

1. Open a second terminal window and navigate to the frontend directory:
   ```bash
   cd contact_book/frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
   *(or `npx ng serve`)*
4. Open your browser and navigate to:
   👉 **[http://localhost:4200](http://localhost:4200)**

---

## 🌐 CORS Configuration

The backend is configured to accept cross-origin requests from the Angular application running at `http://localhost:4200`.

- Configured globally in `com.example.contactbook.config.CorsConfig`
- Also annotated with `@CrossOrigin(origins = "http://localhost:4200")` on `ContactController`
- Allows HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`

---

## 📡 REST API Reference

All endpoints are hosted under `http://localhost:8080/api/contacts`:

| HTTP Method | Endpoint | Description | Request Body | Response Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/contacts` | Get all contacts or paginated list | *None* | `200 OK` |
| **GET** | `/api/contacts?q={query}` | Search contacts by name or city | *None* | `200 OK` |
| **GET** | `/api/contacts?page=0&size=5&sortBy=name&sortDir=asc` | Server-side pagination & sort | *None* | `200 OK` |
| **GET** | `/api/contacts/{id}` | Get single contact by ID | *None* | `200 OK` / `404 Not Found` |
| **POST** | `/api/contacts` | Create a new contact | JSON Contact payload | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/contacts/{id}` | Update existing contact | JSON Contact payload | `200 OK` / `404 Not Found` / `400 Bad Request` |
| **DELETE** | `/api/contacts/{id}` | Delete a contact | *None* | `200 OK` / `404 Not Found` |
| **PATCH** | `/api/contacts/{id}/favorite` | Toggle favorite status | *None* | `200 OK` / `404 Not Found` |

### Sample Contact JSON Payload
```json
{
  "name": "Bruce Wayne",
  "phone": "9876543210",
  "email": "bruce.wayne@example.com",
  "city": "Gotham",
  "favorite": true
}
```

---

## 🧪 Testing with cURL

You can test the backend directly using your terminal:

### 1. Retrieve all contacts
```bash
curl http://localhost:8080/api/contacts
```

### 2. Search contacts by city or name
```bash
curl "http://localhost:8080/api/contacts?q=Seattle"
```

### 3. Server-side pagination and sorting (Stretch Goal)
```bash
curl "http://localhost:8080/api/contacts?page=0&size=3&sortBy=name&sortDir=asc"
```

### 4. Create a new contact (HTTP 201 Created)
```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Bruce Wayne\",\"phone\":\"9876543210\",\"email\":\"bruce@wayne.com\",\"city\":\"Gotham\",\"favorite\":true}"
```

### 5. Trigger validation error (HTTP 400 Bad Request)
```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"\",\"phone\":\"123\",\"email\":\"not-an-email\",\"city\":\"\"}"
```
Returns:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for one or more fields",
  "errors": {
    "name": "Name is required",
    "phone": "Phone number must be exactly 10 digits (digits only)",
    "email": "Must provide a valid email address (e.g., user@example.com)",
    "city": "City is required"
  }
}
```

### 6. Delete a contact
```bash
curl -X DELETE http://localhost:8080/api/contacts/1
```

---

## 📝 Seed Data

When the backend runs for the very first time on an empty database, `DatabaseSeeder.java` automatically creates 5 sample contacts:
1. **Alice Johnson** — 9876543210 — alice.johnson@example.com — Seattle (Favorite ⭐)
2. **Bob Smith** — 8765432109 — bob.smith@example.com — San Francisco
3. **Charlie Davis** — 7654321098 — charlie.davis@example.com — New York (Favorite ⭐)
4. **Diana Prince** — 6543210987 — diana.prince@example.com — Austin
5. **Ethan Hunt** — 5432109876 — ethan.hunt@example.com — Chicago (Favorite ⭐)

