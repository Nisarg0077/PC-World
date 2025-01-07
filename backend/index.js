const express = require('express');
const mongoose = require('mongoose');
const Products = require('./schemas/Products');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminUser = require('./schemas/AdminUsers');
const cors = require('cors');
const app = express();
const port = 5000;

process.setMaxListeners(15); // Increase max listeners

const uri = 'mongodb://127.0.0.1:27017/pc-world'; 

app.use(cors());
app.use(express.json()); // <-- This middleware parses JSON bodies for all incoming requests

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Simple route to test the server
app.get('/', (req, res) => {
  res.send("Hello");
});

// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Products.find(); 
    res.json(products); 
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Fetch all admin users
app.get('/api/login', async (req, res) => {
  try {
    const adminUsers = await AdminUser.find(); // Fetch all AdminUser records from the database
    res.json(adminUsers); // Send the records as JSON response
  } catch (error) {
    console.error('Error fetching AdminUser:', error);
    res.status(500).json({ error: 'Failed to fetch AdminUser' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username)
  try {
    // Find user by username (not email)
    const user = await AdminUser.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the password (plaintext comparison)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
