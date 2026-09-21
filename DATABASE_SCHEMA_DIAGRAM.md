# 📊 Database Schema Entity-Relationship (ER) Diagram

This document contains the visual Entity-Relationship (ER) diagram for our **Food Delivery Platform**, detailing all 8 core tables, their attributes, primary keys (PK), foreign keys (FK), unique constraints (UK), and relationships across the **Customer**, **Admin**, and **Delivery Partner** panels.

---

## 🗺️ Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o| DELIVERY_PARTNERS : "has profile (1:1)"
    USERS ||--o{ ADDRESSES : "owns multiple (1:N)"
    USERS ||--o{ ORDERS : "places as customer (1:N)"
    
    RESTAURANTS ||--o{ MENU_ITEMS : "offers (1:N)"
    RESTAURANTS ||--o{ ORDERS : "receives / prepares (1:N)"
    
    CATEGORIES ||--o{ MENU_ITEMS : "classifies (1:N)"
    
    DELIVERY_PARTNERS ||--o{ ORDERS : "delivers (1:N)"
    
    ADDRESSES ||--o{ ORDERS : "delivery destination (1:N)"
    
    ORDERS ||--|{ ORDER_ITEMS : "contains (1:N)"
    MENU_ITEMS ||--o{ ORDER_ITEMS : "ordered as (1:N)"

    USERS {
        bigint id PK "Primary Key"
        string full_name "User's full name"
        string email UK "Unique login email"
        string password_hash "Bcrypt hashed password"
        string phone "Contact number"
        string role "ROLE_CUSTOMER | ROLE_ADMIN | ROLE_DELIVERY_PARTNER"
        timestamp created_at "Account creation timestamp"
    }

    ADDRESSES {
        bigint id PK "Primary Key"
        bigint user_id FK "References USERS(id)"
        string label "Home, Work, Other"
        string street_address "Street and door number"
        string city "City name"
        string state "State name"
        string postal_code "Zipcode"
        decimal latitude "GPS Latitude (for route map)"
        decimal longitude "GPS Longitude (for route map)"
        boolean is_default "Default delivery address"
    }

    DELIVERY_PARTNERS {
        bigint id PK "Primary Key"
        bigint user_id FK "References USERS(id) - 1:1"
        string vehicle_type "BIKE | SCOOTER | ELECTRIC_VEHICLE | CAR"
        string vehicle_number "e.g. KA-01-AB-1234"
        string status "ONLINE | OFFLINE | BUSY"
        decimal current_latitude "Rider live GPS latitude"
        decimal current_longitude "Rider live GPS longitude"
        decimal total_earnings "Cumulative earnings in $"
    }

    RESTAURANTS {
        bigint id PK "Primary Key"
        string name "Restaurant title"
        string description "Cuisine and highlights"
        string address "Physical outlet address"
        decimal latitude "Outlet GPS Latitude"
        decimal longitude "Outlet GPS Longitude"
        string image_url "Cover photo URL"
        decimal rating "Customer rating (e.g. 4.7)"
        int delivery_time_mins "Estimated preparation + delivery time"
        decimal delivery_fee "Base delivery charge"
        boolean is_active "Open for orders or closed"
        timestamp created_at "Registration date"
    }

    CATEGORIES {
        bigint id PK "Primary Key"
        string name UK "e.g. Burgers, Pizza, Asian, Desserts"
        string icon_url "Category icon image URL"
    }

    MENU_ITEMS {
        bigint id PK "Primary Key"
        bigint restaurant_id FK "References RESTAURANTS(id)"
        bigint category_id FK "References CATEGORIES(id)"
        string name "Dish name"
        string description "Ingredients & details"
        decimal price "Current selling price"
        string image_url "Dish image URL"
        boolean is_veg "True if vegetarian, False if non-veg"
        boolean is_available "In-stock toggle"
        timestamp created_at "Created date"
    }

    ORDERS {
        bigint id PK "Primary Key"
        bigint customer_id FK "References USERS(id)"
        bigint restaurant_id FK "References RESTAURANTS(id)"
        bigint delivery_partner_id FK "References DELIVERY_PARTNERS(id) [Nullable]"
        bigint address_id FK "References ADDRESSES(id)"
        decimal subtotal "Sum of ordered item prices"
        decimal delivery_fee "Delivery cost"
        decimal tax_amount "Government / platform taxes"
        decimal total_amount "Final charge to customer"
        string status "PLACED | PREPARING | READY_FOR_PICKUP | OUT_FOR_DELIVERY | DELIVERED | CANCELLED"
        string delivery_otp "4-digit OTP shared with rider at delivery"
        boolean otp_verified "Flag checked by rider before completion"
        string payment_status "PENDING | PAID | FAILED"
        string payment_method "UPI | CARD | COD"
        timestamp created_at "Order placement time"
        timestamp updated_at "Status change time"
    }

    ORDER_ITEMS {
        bigint id PK "Primary Key"
        bigint order_id FK "References ORDERS(id)"
        bigint menu_item_id FK "References MENU_ITEMS(id)"
        int quantity "Number of servings ordered"
        decimal unit_price "Price snapshot at time of purchase"
        decimal subtotal "quantity * unit_price"
    }
```

---

## 🔗 Table Relationships Explained

### 1. `USERS` ⟷ `DELIVERY_PARTNERS` (One-to-One / `1:1`)
- Every delivery partner is fundamentally a `User` (for authentication, email, password, phone).
- The `DELIVERY_PARTNERS` table stores rider-specific data (vehicle number, status, GPS coordinates, earnings) linked via `user_id`.

### 2. `USERS` ⟷ `ADDRESSES` (One-to-Many / `1:N`)
- A single customer can save multiple addresses ("Home", "Work", "Parents' Place").
- When checking out, the customer selects one address ID, which gets recorded on the `ORDERS` table.

### 3. `RESTAURANTS` ⟷ `MENU_ITEMS` (One-to-Many / `1:N`)
- A restaurant has many dishes on its menu.
- If a restaurant is removed or closed, its menu items are tied to it via `restaurant_id` foreign key.

### 4. `CATEGORIES` ⟷ `MENU_ITEMS` (One-to-Many / `1:N`)
- Each menu item belongs to a category (e.g. "Cheeseburger" belongs to "Burgers").
- Helps the customer filter by category with a single click.

### 5. `ORDERS` ⟷ `ORDER_ITEMS` ⟷ `MENU_ITEMS`
- An order contains multiple items (e.g. 2 Burgers + 1 Coke).
- `ORDER_ITEMS` is an associative entity that connects `ORDERS` and `MENU_ITEMS`.
- Crucially, it stores `unit_price` as a **price snapshot** so changes to the restaurant menu never tamper with historic receipts.

### 6. `ORDERS` ⟷ `DELIVERY_PARTNERS` (Many-to-One / `N:1`, Nullable)
- When an order is initially `PLACED` or `PREPARING`, `delivery_partner_id` is `NULL`.
- Once the kitchen marks the order `READY_FOR_PICKUP`, an active delivery rider accepts it, and their ID is assigned to `orders.delivery_partner_id`.
- The rider sees the customer's drop-off coordinates, approaches their door, requests the 4-digit `delivery_otp`, and marks it `DELIVERED`.
