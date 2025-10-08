const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'postgres',
  host: 'postgres-service',
  database: 'guestbook',
  password: 'password',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Test connection on startup with retry
async function connectWithRetry(attempts = 5, delay = 2000) {
  for (let i = 0; i < attempts; i++) {
    try {
      await pool.connect();
      console.log('Connected to PostgreSQL');
      return;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed: ${err.message}`);
      if (i < attempts - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to connect to PostgreSQL after retries');
}

connectWithRetry();

app.get('/', (req, res) => {
  console.log('Serving /');
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/message', async (req, res) => {
  console.log('Received POST /message:', req.body);
  try {
    const { message } = req.body;
    if (!message) throw new Error('Message is empty');
    await pool.query('INSERT INTO messages (content) VALUES ($1)', [message]);
    console.log('Message inserted:', message);
    res.redirect('/');
  } catch (err) {
    console.error('Error inserting message:', err.message);
    res.status(500).send('Error saving message: ' + err.message);
  }
});

app.get('/messages', async (req, res) => {
  console.log('Serving /messages');
  try {
    const result = await pool.query('SELECT * FROM messages');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ error: 'Error fetching messages: ' + err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
