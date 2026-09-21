-- ====================================================================
-- DAY 1: DATABASE SCHEMA DESIGN FOR FOOD DELIVERY PLATFORM
-- Multi-Portal Architecture: Customer, Admin, and Delivery Partner
-- Target: PostgreSQL / MySQL / H2 compatible DDL
-- ====================================================================

-- 1. USERS TABLE
-- Stores credentials and roles for all 3 panels: CUSTOMER, ADMIN, DELIVERY_PARTNER
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('ROLE_CUSTOMER', 'ROLE_ADMIN', 'ROLE_DELIVERY_PARTNER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMER ADDRESSES TABLE
-- Stores saved locations for customers (Home, Work, etc.) with coordinates for routing
CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    label VARCHAR(50) DEFAULT 'Home', -- Home, Work, Other
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. DELIVERY PARTNER PROFILE TABLE
-- Dedicated details for delivery riders: status, coordinates, vehicle, earnings
CREATE TABLE delivery_partners (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    vehicle_type VARCHAR(30) NOT NULL CHECK (vehicle_type IN ('BIKE', 'SCOOTER', 'ELECTRIC_VEHICLE', 'CAR')),
    vehicle_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OFFLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'BUSY')),
    current_latitude DECIMAL(10, 7) DEFAULT 12.9716, -- Default example coordinates (e.g. Bangalore center)
    current_longitude DECIMAL(10, 7) DEFAULT 77.5946,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    CONSTRAINT fk_delivery_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. RESTAURANTS TABLE
-- Stores restaurant outlets managed via Admin panel
CREATE TABLE restaurants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    image_url VARCHAR(500),
    rating DECIMAL(2, 1) DEFAULT 4.5,
    delivery_time_mins INT DEFAULT 30,
    delivery_fee DECIMAL(6, 2) DEFAULT 35.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CATEGORIES TABLE
-- Classification tags for food items (Burgers, Pizzas, Desserts, Beverages, etc.)
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(500)
);

-- 6. MENU ITEMS TABLE
-- Specific dishes sold by restaurants
CREATE TABLE menu_items (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(8, 2) NOT NULL,
    image_url VARCHAR(500),
    is_veg BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    -- AI Generated Nutritional Breakdown
    calories_kcal INT DEFAULT 450,
    protein_g DECIMAL(5, 1) DEFAULT 18.0,
    carbs_g DECIMAL(5, 1) DEFAULT 45.0,
    fat_g DECIMAL(5, 1) DEFAULT 14.0,
    fiber_g DECIMAL(5, 1) DEFAULT 4.0,
    allergens VARCHAR(255) DEFAULT 'Gluten, Dairy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_menu_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT fk_menu_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 7. ORDERS TABLE
-- Central order entity tracking lifecycle across Customer, Admin, and Delivery Partner
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    delivery_partner_id BIGINT, -- Assigned when delivery partner accepts order
    address_id BIGINT NOT NULL,
    
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(6, 2) NOT NULL,
    tax_amount DECIMAL(6, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED' CHECK (
        status IN ('PLACED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')
    ),
    
    -- OTP Delivery Verification: 4-digit code generated upon order creation
    delivery_otp VARCHAR(4) NOT NULL,
    otp_verified BOOLEAN DEFAULT FALSE,
    
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'UPI' CHECK (payment_method IN ('UPI', 'CARD', 'COD')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_order_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_order_delivery_partner FOREIGN KEY (delivery_partner_id) REFERENCES delivery_partners(id) ON DELETE SET NULL,
    CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT
);

-- 8. ORDER ITEMS TABLE
-- Snapshot of items included in each order (preserves price at time of purchase)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(8, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_delivery_partner ON orders(delivery_partner_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
