-- Role Enum
CREATE TYPE user_role AS ENUM ('System Administrator', 'Normal User', 'Store Owner');

-- Users Table with character constraints
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL CHECK (char_length(address) >= 5 AND char_length(address) <= 400),
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings Table (1 to 5 rating range)
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, store_id)
);

-- Sample Admin User (Password: Admin@123)
INSERT INTO users (name, email, password, address, role) 
VALUES (
    'System Admin', 
    'admin@storerating.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '123 Admin Street, City, Country',
    'System Administrator'
);

-- Sample Store Owner (Password: Owner@123)
INSERT INTO users (name, email, password, address, role) 
VALUES (
    'John Doe', 
    'owner@storerating.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '456 Owner Avenue, City, Country',
    'Store Owner'
);

-- Sample Normal User (Password: User@123)
INSERT INTO users (name, email, password, address, role) 
VALUES (
    'Jane Smith', 
    'user@storerating.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    '789 User Road, City, Country',
    'Normal User'
);

-- Sample Stores
INSERT INTO stores (name, email, address, owner_id) 
VALUES 
    ('Best Electronics', 'contact@bestelectronics.com', '100 Tech Street, Silicon Valley, CA', 2),
    ('Fresh Mart', 'info@freshmart.com', '200 Grocery Lane, Downtown, NY', 2);

-- Sample Ratings
INSERT INTO ratings (user_id, store_id, rating) 
VALUES 
    (3, 1, 5),
    (3, 2, 4);