const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { ObjectId } = require('mongodb');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Brand = require('./models/Brands');
const cors = require('cors');
const ProductType = require('./models/ProductType');
const app = express();
const port = 5000;
const productMigation = require('./migration/product-migration');
const userMaigration = require('./migration/user-migration');
const brandMaigration = require('./migration/brands-migration');
const prodTypMigration = require('./migration/prodTyp-migration');

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



  const path = require('path');
  app.use('/images', express.static(path.join(__dirname, 'images')));
  



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

// app.post('/api/productInfo/', async (req, res) => {
//   try {
//     const pid = new Product(req.body);
//     console.log(pid);

//     const objectId = new ObjectId(pid);
    
//     const product = await Product.find({_id: objectId}); 

//     res.json(product); 
//     console.log(product); 
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// });

// app.post('/api/productInfo', async (req, res) => {
//   try {
//     const { pid } = req.body; // Extract pid from request body
//     console.log('Received pid:', pid);

//     if (!ObjectId.isValid(pid)) {
//       return res.status(400).json({ error: 'Invalid Product ID' });
//     }

//     const product = await Product.findOne({ _id: new ObjectId(pid) }); // Query for the product

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json(product); // Send product info as response
//     // console.log('Product fetched:', product);
//   } catch (error) {
//     // console.error('Error fetching product:', error);
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// });

app.post('/api/productInfo', async (req, res) => {
  try {
    const { pid } = req.body;

    if (!ObjectId.isValid(pid)) {
      return res.status(400).json({ error: 'Invalid Product ID' });
    }

    const product = await Product.findOne({ _id: new ObjectId(pid) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Add the full image URL to the product data
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    product.imageUrl = `${baseUrl}/images/${product.imageUrl}`; // Assuming `imageFilename` stores the image file name in the database

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
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
    console.log('Received Data:', req.body); // Log the received data
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error });
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
  // console.log(username)
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
  productMigation();
});



app.get('/mgrt/user', (req, res) => {
    userMaigration();
});

app.get('/mgrt/brands', (req, res) => {
  brandMaigration()
});

app.get('/mgrt/prodType', (req, res) => {
  prodTypMigration()
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
