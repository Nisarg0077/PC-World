const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Brand = require('./models/Brands');
const cors = require('cors');
const ProductType = require('./models/ProductType');
const app = express();
const port = 5000;
const productMigation = require('./migration/product-migration');


process.setMaxListeners(15);

const uri = 'mongodb://127.0.0.1:27017/pc-world'; 

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send("Hello");
});

app.post('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products); 
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
// app.post('/api/productsin', async (req, res) => {
//   try {
//     const cpuData = req.body;
//     const data = await Product.save(cpuData); 
//     res.json(data); 
//   } catch (error) {
//     console.error('Error inserting products:', error);
//     res.status(500).json({ error: 'Failed to insert products' });
//   }
// });

app.post('/api/productsin', async (req, res) => {
  try {
    const { 
      name, 
      category, 
      brand, 
      model, 
      description, 
      price, 
      stock, 
      imageUrl, 
      specifications: { cpu } 
    } = req.body; 

    const newProduct = new Product({ 
      name, 
      category, 
      brand, 
      model, 
      description, 
      price, 
      stock, 
      imageUrl, 
      specifications: { cpu } 
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    console.error('Error inserting product:', error);
    res.status(500).json({ error: 'Failed to insert product' });
  }
});

app.post('/api/brands', async (req, res) => {
  try {
    const brand = await Brand.find(); 
    res.json(brand); 
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

app.post('/api/prodtype', async (req, res) => {
  try {
    const prodType = await ProductType.find(); 
    res.json(prodType); 
  } catch (error) {
    console.error('Error fetching prodType:', error);
    res.status(500).json({ error: 'Failed to fetch prodType' });
  }
});

app.get('/api/login', async (req, res) => {
  try {
    const adminUsers = await User.find();
    res.json(adminUsers);
  } catch (error) {
    console.error('Error fetching AdminUser:', error);
    res.status(500).json({ error: 'Failed to fetch AdminUser' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username)
  try {
    const user = await User.findOne({ 
      username: username, 
      role: 'admin' 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


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

app.get('/mgrt/prod', (req, res) => {
  // const data =  
  productMigation();
    // console.log(data);
    // res.json(data)
    // productMigation();
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
