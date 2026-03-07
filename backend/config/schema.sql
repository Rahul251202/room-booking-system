CREATE DATABASE IF NOT EXISTS room_booking;
USE room_booking;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,
  capacity INT NOT NULL DEFAULT 2,
  image_url VARCHAR(500),
  amenities JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

INSERT INTO rooms (name, description, price_per_night, capacity, image_url, amenities) VALUES
('Deluxe Ocean Suite', 'Beautiful ocean view suite.', 299.00, 2, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', '["Ocean View", "King Bed", "Balcony", "WiFi"]'),
('Garden Villa', 'Peaceful garden villa.', 199.00, 4, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', '["Garden View", "2 Queen Beds", "WiFi", "Kitchen"]'),
('Executive City Room', 'Modern city view room.', 149.00, 2, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', '["City View", "Queen Bed", "WiFi", "Work Desk"]'),
('Penthouse Loft', 'Luxury penthouse suite.', 599.00, 4, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', '["Panoramic View", "King Bed", "Rooftop", "Butler"]'),
('Cozy Mountain Cabin', 'Rustic mountain cabin.', 179.00, 3, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', '["Mountain View", "King Bed", "Fireplace", "Hot Tub"]'),
('Classic Double Room', 'Comfortable classic room.', 99.00, 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', '["Pool View", "Double Bed", "WiFi", "TV"]');