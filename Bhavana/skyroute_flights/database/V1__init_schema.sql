-- ==============================================================================
-- SkyRoute PostgreSQL Database Initialization Schema (Flyway V1 Migration)
-- ==============================================================================

-- 1. Roles & Users
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone_number VARCHAR(30),
    date_of_birth DATE,
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 2. Aviation Master Data (Airports, Airlines, Aircraft)
CREATE TABLE airports (
    id BIGSERIAL PRIMARY KEY,
    iata_code VARCHAR(3) NOT NULL UNIQUE,
    icao_code VARCHAR(4) UNIQUE,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE airlines (
    id BIGSERIAL PRIMARY KEY,
    iata_code VARCHAR(3) NOT NULL UNIQUE,
    icao_code VARCHAR(4) UNIQUE,
    name VARCHAR(150) NOT NULL,
    logo_url VARCHAR(500),
    country VARCHAR(100),
    callsign VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE aircraft (
    id BIGSERIAL PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    total_capacity INT NOT NULL,
    economy_capacity INT NOT NULL,
    premium_economy_capacity INT DEFAULT 0,
    business_capacity INT DEFAULT 0,
    first_class_capacity INT DEFAULT 0,
    seat_layout_config JSONB
);

-- 3. Flights & Schedules
CREATE TABLE flights (
    id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    airline_id BIGINT NOT NULL REFERENCES airlines(id),
    origin_airport_id BIGINT NOT NULL REFERENCES airports(id),
    destination_airport_id BIGINT NOT NULL REFERENCES airports(id),
    aircraft_id BIGINT REFERENCES aircraft(id),
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    distance_km INT,
    stops_count INT DEFAULT 0,
    base_fare NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    is_refundable BOOLEAN DEFAULT TRUE,
    baggage_cabin_kg INT DEFAULT 7,
    baggage_checkin_kg INT DEFAULT 15,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flight_schedules (
    id BIGSERIAL PRIMARY KEY,
    flight_id BIGINT NOT NULL REFERENCES flights(id),
    scheduled_departure_date DATE NOT NULL,
    departure_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    available_economy_seats INT NOT NULL,
    available_premium_seats INT DEFAULT 0,
    available_business_seats INT DEFAULT 0,
    available_first_seats INT DEFAULT 0,
    current_economy_price NUMERIC(10, 2) NOT NULL,
    current_business_price NUMERIC(10, 2),
    status VARCHAR(30) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(flight_id, scheduled_departure_date)
);

CREATE TABLE flight_seats (
    id BIGSERIAL PRIMARY KEY,
    schedule_id BIGINT NOT NULL REFERENCES flight_schedules(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    cabin_class VARCHAR(30) NOT NULL, -- ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    seat_type VARCHAR(30) NOT NULL, -- WINDOW, AISLE, MIDDLE, EXTRA_LEGROOM, EMERGENCY_EXIT
    price_surcharge NUMERIC(10, 2) DEFAULT 0.00,
    is_booked BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0,
    UNIQUE(schedule_id, seat_number)
);

-- 4. Bookings & Passengers
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    pnr VARCHAR(10) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    schedule_id BIGINT NOT NULL REFERENCES flight_schedules(id),
    booking_status VARCHAR(30) NOT NULL, -- PENDING, CONFIRMED, CANCELLED, COMPLETED, REFUND_PENDING, REFUNDED
    cabin_class VARCHAR(30) NOT NULL,
    passenger_count INT NOT NULL,
    base_amount NUMERIC(10, 2) NOT NULL,
    seat_charges NUMERIC(10, 2) DEFAULT 0.00,
    addon_charges NUMERIC(10, 2) DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passengers (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    passenger_type VARCHAR(20) DEFAULT 'ADULT', -- ADULT, CHILD, INFANT
    passport_number VARCHAR(50),
    nationality VARCHAR(60) DEFAULT 'Indian',
    seat_number VARCHAR(10),
    meal_preference VARCHAR(50),
    extra_baggage_kg INT DEFAULT 0,
    insurance_opted BOOLEAN DEFAULT FALSE
);

-- 5. Payments, Cancellations & Refunds
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id),
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL, -- CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, WALLET
    payment_gateway VARCHAR(50) NOT NULL, -- STRIPE, RAZORPAY, MOCK_GATEWAY
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_status VARCHAR(30) NOT NULL, -- INITIATED, SUCCESS, FAILED, TIMEOUT, REFUNDED
    gateway_response_payload JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cancellations (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    cancellation_reason VARCHAR(100) NOT NULL,
    comments TEXT,
    ticket_amount NUMERIC(10, 2) NOT NULL,
    cancellation_fee NUMERIC(10, 2) NOT NULL,
    refund_amount NUMERIC(10, 2) NOT NULL,
    cancellation_status VARCHAR(30) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refunds (
    id BIGSERIAL PRIMARY KEY,
    cancellation_id BIGINT NOT NULL REFERENCES cancellations(id),
    booking_id BIGINT NOT NULL REFERENCES bookings(id),
    payment_id BIGINT REFERENCES payments(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    refund_amount NUMERIC(10, 2) NOT NULL,
    refund_reference VARCHAR(100) UNIQUE,
    refund_status VARCHAR(30) DEFAULT 'PROCESSING', -- NOT_APPLICABLE, REQUESTED, PROCESSING, COMPLETED, FAILED
    processed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notifications, AI Conversations & Auditing
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    session_id VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) DEFAULT 'Travel Inquiry',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- USER, ASSISTANT, SYSTEM
    content TEXT NOT NULL,
    tool_calls JSONB,
    tool_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-speed queries
CREATE INDEX idx_flights_search ON flights(origin_airport_id, destination_airport_id, status);
CREATE INDEX idx_schedules_date ON flight_schedules(flight_id, scheduled_departure_date);
CREATE INDEX idx_bookings_user ON bookings(user_id, booking_status);
CREATE INDEX idx_bookings_pnr ON bookings(pnr);
CREATE INDEX idx_seats_schedule ON flight_seats(schedule_id, is_booked);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
