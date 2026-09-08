-- ==============================================================================
-- SkyRoute Seed Master Data (Airports, Airlines, Aircraft, Demo Users & Flights)
-- ==============================================================================

-- Roles
INSERT INTO roles (id, name, description) VALUES 
(1, 'ROLE_USER', 'Standard registered customer'),
(2, 'ROLE_ADMIN', 'System administrator with flight, booking and refund control');

-- Seed Admin (Password: Admin@123 -> BCrypt hash) & Demo User (Password: User@123)
-- BCrypt hashes:
-- Admin@123: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- User@123:  $2a$10$e8w.n8uJzYk56p3gM7.u.OTXF3tVbT3w6hC/fFjV01pTf0M9Hj7q2
INSERT INTO users (id, email, password_hash, full_name, phone_number, is_active, is_email_verified) VALUES
(1, 'admin@skyroute.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SkyRoute Administrator', '+91 9876543210', TRUE, TRUE),
(2, 'john.doe@example.com', '$2a$10$e8w.n8uJzYk56p3gM7.u.OTXF3tVbT3w6hC/fFjV01pTf0M9Hj7q2', 'Johnathan Doe', '+91 9123456789', TRUE, TRUE),
(3, 'sarah.connor@example.com', '$2a$10$e8w.n8uJzYk56p3gM7.u.OTXF3tVbT3w6hC/fFjV01pTf0M9Hj7q2', 'Sarah Connor', '+1 5550192834', TRUE, TRUE);

INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 2), -- Admin is ROLE_ADMIN
(1, 1), -- Admin also has ROLE_USER
(2, 1), -- John is ROLE_USER
(3, 1); -- Sarah is ROLE_USER

-- Major Hub Airports
INSERT INTO airports (id, iata_code, icao_code, name, city, country, latitude, longitude, timezone) VALUES
(1, 'BLR', 'VOBL', 'Kempegowda International Airport', 'Bengaluru', 'India', 13.1986, 77.7066, 'Asia/Kolkata'),
(2, 'DEL', 'VIDP', 'Indira Gandhi International Airport', 'New Delhi', 'India', 28.5562, 77.1000, 'Asia/Kolkata'),
(3, 'BOM', 'VABB', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India', 19.0896, 72.8656, 'Asia/Kolkata'),
(4, 'DXB', 'OMDB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates', 25.2532, 55.3657, 'Asia/Dubai'),
(5, 'SIN', 'WSSS', 'Singapore Changi Airport', 'Singapore', 'Singapore', 1.3644, 103.9915, 'Asia/Singapore'),
(6, 'LHR', 'EGLL', 'London Heathrow Airport', 'London', 'United Kingdom', 51.4700, -0.4543, 'Europe/London'),
(7, 'JFK', 'KJFK', 'John F. Kennedy International Airport', 'New York', 'United States', 40.6413, -73.7781, 'America/New_York'),
(8, 'HYD', 'VOHS', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India', 17.2403, 78.4294, 'Asia/Kolkata'),
(9, 'MAA', 'VOMM', 'Chennai International Airport', 'Chennai', 'India', 12.9941, 80.1709, 'Asia/Kolkata'),
(10, 'CCU', 'VECC', 'Netaji Subhash Chandra Bose International Airport', 'Kolkata', 'India', 22.6547, 88.4467, 'Asia/Kolkata');

-- Premium & Budget Airlines
INSERT INTO airlines (id, iata_code, icao_code, name, logo_url, country, callsign) VALUES
(1, '6E', 'IGO', 'IndiGo', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80', 'India', 'IFLY'),
(2, 'AI', 'AIC', 'Air India', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=120&q=80', 'India', 'AIRINDIA'),
(3, 'EK', 'UAE', 'Emirates', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80', 'United Arab Emirates', 'EMIRATES'),
(4, 'SQ', 'SIA', 'Singapore Airlines', 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=120&q=80', 'Singapore', 'SINGAPORE'),
(5, 'BA', 'BAW', 'British Airways', 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=120&q=80', 'United Kingdom', 'SPEEDBIRD'),
(6, 'QP', 'AKJ', 'Akasa Air', 'https://images.unsplash.com/photo-1517479149777-5f3b1511d7ad?auto=format&fit=crop&w=120&q=80', 'India', 'AKASA');

-- Aircraft Configurations
INSERT INTO aircraft (id, model, manufacturer, total_capacity, economy_capacity, premium_economy_capacity, business_capacity, first_class_capacity) VALUES
(1, 'Airbus A320neo', 'Airbus', 186, 186, 0, 0, 0),
(2, 'Boeing 737 MAX 8', 'Boeing', 189, 162, 15, 12, 0),
(3, 'Boeing 777-300ER', 'Boeing', 354, 250, 40, 56, 8),
(4, 'Airbus A350-900', 'Airbus', 316, 220, 36, 52, 8);

-- Flights
INSERT INTO flights (id, flight_number, airline_id, origin_airport_id, destination_airport_id, aircraft_id, departure_time, arrival_time, duration_minutes, distance_km, stops_count, base_fare, tax_amount, is_refundable, baggage_cabin_kg, baggage_checkin_kg) VALUES
(1, '6E-1234', 1, 1, 2, 1, '06:30:00', '09:20:00', 170, 1740, 0, 5800.00, 699.00, TRUE, 7, 15),
(2, 'AI-505', 2, 1, 2, 2, '08:00:00', '10:45:00', 165, 1740, 0, 6400.00, 750.00, TRUE, 7, 25),
(3, '6E-208', 1, 1, 3, 1, '09:15:00', '10:55:00', 100, 840, 0, 4200.00, 550.00, TRUE, 7, 15),
(4, 'AI-639', 2, 3, 2, 2, '11:00:00', '13:10:00', 130, 1150, 0, 5100.00, 620.00, TRUE, 7, 20),
(5, 'EK-565', 3, 1, 4, 3, '10:30:00', '13:15:00', 255, 2700, 0, 18500.00, 2400.00, TRUE, 7, 30),
(6, 'SQ-509', 4, 1, 5, 4, '23:10:00', '06:10:00', 270, 3180, 0, 22000.00, 3100.00, TRUE, 7, 30),
(7, 'BA-118', 5, 1, 6, 3, '07:05:00', '13:00:00', 625, 7250, 0, 48000.00, 6200.00, TRUE, 7, 23),
(8, '6E-804', 1, 2, 1, 1, '18:45:00', '21:35:00', 170, 1740, 0, 5950.00, 710.00, TRUE, 7, 15),
(9, 'QP-1351', 6, 1, 3, 2, '14:20:00', '16:00:00', 100, 840, 0, 3950.00, 480.00, TRUE, 7, 15),
(10, 'AI-803', 2, 2, 8, 2, '15:10:00', '17:25:00', 135, 1250, 0, 4850.00, 580.00, TRUE, 7, 20);
