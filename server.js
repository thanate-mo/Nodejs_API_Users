const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname,'data','data.json');

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all users
app.get('/api/users', (req, res) => {
  const users = readData();
  res.json(users);
});

// Create user
app.post('/api/users', (req, res) => {
  const users = readData();
  const newUser = { id: uuidv4(), ...req.body };
  users.push(newUser);
  writeData(users);
  res.json(newUser);
});

// Update user
app.put('/api/users/:id', (req, res) => {
  let users = readData();
  users = users.map(user => user.id === req.params.id ? { ...user, ...req.body } : user);
  writeData(users);
  res.json({ message: 'Updated' });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  let users = readData();
  users = users.filter(user => user.id !== req.params.id);
  writeData(users);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
