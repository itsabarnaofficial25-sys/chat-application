-- ============================================
-- CHAT APPLICATION DATABASE SETUP
-- Complete database with sample data
-- ============================================

-- Step 1: Drop existing database if exists (optional - be careful!)
-- DROP DATABASE IF EXISTS chat_app;

-- Step 2: Create database
CREATE DATABASE IF NOT EXISTS chat_app;
USE chat_app;

-- Step 3: Create tables
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    username VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Active users table
CREATE TABLE IF NOT EXISTS active_users (
    socket_id VARCHAR(100) PRIMARY KEY,
    user_id INT,
    username VARCHAR(50),
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 4: Insert sample users
INSERT IGNORE INTO users (username) VALUES 
('Abarna'),
('Kumar'),
('Priya'),
('Rajesh'),
('Divya'),
('Suresh'),
('Meena');

-- Step 5: Insert sample messages
-- First, get user IDs and insert messages
INSERT INTO messages (user_id, username, message, created_at) VALUES 
(1, 'Abarna', 'Hello everyone! Welcome to the chat!', NOW() - INTERVAL 2 DAY),
(2, 'Kumar', 'Hi Abarna! Good to see you here.', NOW() - INTERVAL 2 DAY),
(3, 'Priya', 'Hey everyone! How are you all doing?', NOW() - INTERVAL 1 DAY),
(1, 'Abarna', 'I am doing great! This is a real-time chat app.', NOW() - INTERVAL 1 DAY),
(4, 'Rajesh', 'Awesome! Real-time messaging is so cool!', NOW() - INTERVAL 12 HOUR),
(5, 'Divya', 'Can you guys see my message immediately?', NOW() - INTERVAL 6 HOUR),
(2, 'Kumar', 'Yes! This is working perfectly!', NOW() - INTERVAL 3 HOUR),
(3, 'Priya', 'I love how fast messages appear!', NOW() - INTERVAL 2 HOUR),
(1, 'Abarna', 'Let me know if anyone needs help!', NOW() - INTERVAL 1 HOUR),
(6, 'Suresh', 'This is amazing technology!', NOW() - INTERVAL 30 MINUTE),
(7, 'Meena', 'Hello all! Just joined the conversation.', NOW() - INTERVAL 15 MINUTE);

-- Step 6: Insert some active users (sample online users)
INSERT INTO active_users (socket_id, user_id, username, last_seen) VALUES 
('socket_001', 1, 'Abarna', NOW()),
('socket_002', 2, 'Kumar', NOW()),
('socket_003', 3, 'Priya', NOW());

-- Step 7: Verify data
SELECT '=== DATABASE SETUP COMPLETE ===' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Messages FROM messages;
SELECT COUNT(*) as Active_Users FROM active_users;