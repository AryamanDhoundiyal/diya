const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '8520',
  database: 'record' // Change to your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Set up multer for handling multipart/form-data
const storage = multer.memoryStorage(); // Use memory storage to handle blob data
const upload = multer({ storage });

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle file uploads
app.post('/camera', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileType = req.body.fileType;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Save the file data to the database
  const query = 'INSERT INTO media_files (file_type, file_data) VALUES (?, ?)';
  
  db.query(query, [fileType, file.buffer], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'File uploaded successfully' });
  });
});

// Route to retrieve files (for example)
app.get('/camera', (req, res) => {
  const id = req.params.id;

  db.query('SELECT file_type, file_data FROM media_files WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = results[0];
    res.setHeader('Content-Type', file.file_type === 'photo' ? 'image/jpeg' : 'video/webm');
    res.send(file.file_data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
