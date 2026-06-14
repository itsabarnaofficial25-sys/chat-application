const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // Change this
    database: 'chat_app'
});

db.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to database');
    
    // Insert test users
    const users = ['Abarna', 'Kumar', 'Priya', 'Rajesh', 'Divya'];
    
    users.forEach(username => {
        db.query('INSERT IGNORE INTO users (username) VALUES (?)', [username], (err) => {
            if (err) console.error('Error inserting user:', err);
        });
    });
    
    // Insert test messages after users are inserted
    setTimeout(() => {
        const messages = [
            { username: 'Abarna', message: 'Hello everyone! Welcome to the chat!' },
            { username: 'Kumar', message: 'Hi Abarna! Good to see you here.' },
            { username: 'Priya', message: 'Hey everyone! How are you all doing?' },
            { username: 'Abarna', message: 'I am doing great! This is a real-time chat app.' },
            { username: 'Rajesh', message: 'Awesome! Real-time messaging is so cool!' },
            { username: 'Divya', message: 'Can you guys see my message immediately?' },
            { username: 'Kumar', message: 'Yes! This is working perfectly!' }
        ];
        
        messages.forEach(msg => {
            db.query(
                'INSERT INTO messages (user_id, username, message) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?)',
                [msg.username, msg.username, msg.message],
                (err) => {
                    if (err) console.error('Error inserting message:', err);
                }
            );
        });
        
        console.log('✅ Test data inserted successfully!');
        
        // Verify data
        db.query('SELECT COUNT(*) as count FROM users', (err, result) => {
            console.log(`Total users: ${result[0].count}`);
        });
        
        db.query('SELECT COUNT(*) as count FROM messages', (err, result) => {
            console.log(`Total messages: ${result[0].count}`);
        });
        
        setTimeout(() => {
            db.end();
        }, 1000);
    }, 1000);
});