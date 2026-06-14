const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "http://localhost:4200" }
});

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // Change this to your MySQL password
    database: 'chat_app'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// Store messages in memory as backup
const messages = [];
const activeUsers = new Map();

// API to get messages from database
app.get('/api/messages', (req, res) => {
    db.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 50', (err, results) => {
        if (err) {
            res.json([]);
        } else {
            res.json(results.reverse());
        }
    });
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // User joins
    socket.on('join', (username) => {
        console.log('User joined:', username);
        socket.username = username;
        activeUsers.set(socket.id, username);
        
        // Save user to database
        db.query('INSERT IGNORE INTO users (username) VALUES (?)', [username]);
        
        // Get recent messages from database
        db.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 50', (err, dbMessages) => {
            if (dbMessages && dbMessages.length > 0) {
                socket.emit('old-messages', dbMessages.reverse());
            } else {
                socket.emit('old-messages', []);
            }
        });
        
        // Send active users list
        const userList = Array.from(activeUsers.values());
        io.emit('user-list', userList);
        
        // Broadcast user joined
        socket.broadcast.emit('user-joined', username);
    });
    
    // New message
    socket.on('message', (msg) => {
        console.log('Message from', socket.username, ':', msg);
        
        const messageData = {
            id: Date.now(),
            username: socket.username,
            message: msg,
            time: new Date().toLocaleTimeString(),
            created_at: new Date()
        };
        
        // Save to database
        db.query(
            'INSERT INTO messages (user_id, username, message) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?)',
            [socket.username, socket.username, msg],
            (err) => {
                if (err) console.error('Error saving message:', err);
            }
        );
        
        // Save to memory
        messages.push(messageData);
        if (messages.length > 100) messages.shift();
        
        // Broadcast to all users
        io.emit('new-message', messageData);
    });
    
    // Typing indicator
    socket.on('typing', (isTyping) => {
        if (socket.username) {
            socket.broadcast.emit('user-typing', {
                username: socket.username,
                typing: isTyping
            });
        }
    });
    
    // Disconnect
    socket.on('disconnect', () => {
        if (socket.username) {
            console.log('User left:', socket.username);
            activeUsers.delete(socket.id);
            
            const userList = Array.from(activeUsers.values());
            io.emit('user-list', userList);
            io.emit('user-left', socket.username);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});