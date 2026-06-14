require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
cors: {
origin: [
'http://localhost:4200',
process.env.FRONTEND_URL
],
methods: ['GET', 'POST']
}
});

app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
res.send('Chat Application Backend Running Successfully 🚀');
});

// MySQL Connection
const db = mysql.createConnection({
host: process.env.DB_HOST,
port: process.env.DB_PORT || 3306,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});

db.connect((err) => {
if (err) {
console.error('Database connection failed:', err);
return;
}

```
console.log('✅ Connected to MySQL database');
```

});
