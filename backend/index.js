const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { ObjectId } = require('mongodb');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Brand = require('./models/Brands');
const Category = require('./models/Category');
const cors = require('cors');
const ProductType = require('./models/ProductType');
const app = express();
const port = 5000;
const productMigation = require('./migration/product-migration');
const userMaigration = require('./migration/user-migration');
const brandMaigration = require('./migration/brands-migration');
const prodTypMigration = require('./migration/prodTyp-migration');
const multer = require('multer');
const Cart = require('./models/Cart')
// const path = require('path');

process.setMaxListeners(15);

const uri = 'mongodb://127.0.0.1:27017/pc-world'; 

app.use(cors({ origin: "*" }));
app.use(express.json());



mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });



  const path = require('path');
  // app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/images', express.static('images'));
  // const storage = multer.diskStorage({
  //   destination: 'images/', // Folder where images will be stored
  //   filename: (req, file, cb) => {
  //     cb(null, Date.now() + path.extname(file.originalname)); // Store filename with timestamp
  //   }
  // });


  const storage = multer.diskStorage({
    destination: "./images/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send("Hello");
});

// app.post('/api/products', async (req, res) => {
//   try {
//     const products = await Product.find(); 
//     res.json(products); 
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });
app.post('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); 
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Ensure each product gets a full image URL
    const updatedProducts = products.map(product => ({
      ...product._doc,
      imageUrl: `${baseUrl}/images/${product.imageUrl}`  // Construct the full URL for the image
    }));

    res.json(updatedProducts); 
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


// app.post('/api/productInfo', async (req, res) => {
//   try {
//     const { pid } = req.body;
//     console.log(pid)
//     if (!ObjectId.isValid(pid)) {
//       return res.status(400).json({ error: 'Invalid Product ID' });
//     }

//     const product = await Product.findOne({ _id: new ObjectId(pid) });

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     // Add the full image URL to the product data
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
    
//     product.imageUrl = `${baseUrl}/images/${product.imageUrl}`; // Assuming `imageFilename` stores the image file name in the database
//     console.log(product.imageUrl)
//     res.json(product);
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// });

app.post('/api/productInfo', async (req, res) => {
  try {
    const { pid } = req.body;
    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Construct the full image URL based on the filename stored in the database
    const baseUrl = `${req.protocol}://${req.get('host')}/images`; // Full URL for images
    product.imageUrl = `${baseUrl}/${product.imageUrl}`; // Add the base URL to the filename

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});


// GET /api/product/:id - Fetch a specific product by ID
app.get('/api/product/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});




app.post('/api/product/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});




// DELETE /api/products/:id - Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Product ID' });
    }

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' }); // Success message
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
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



app.post('/api/productsin', upload.single('image'), async (req, res) => {
  try {
    const formData = req.body;

    if (req.file) {
      formData.imageUrl = req.file.filename; // Save only the filename in the database
    }

    const product = new Product(formData);
    await product.save();

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error });
  }
});

app.get("/api/brands", async (req, res) => {
  try {
    const brands = await Brand.find();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const updatedBrands = brands.map((brand) => ({
      ...brand._doc,
      logoUrl: brand.logoUrl ? `${baseUrl}/images/${brand.logoUrl}` : null,
    }));

    res.json(updatedBrands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

app.post("/api/brands", async (req, res) => {
  try {
    const { name, country, foundedYear, logoUrl, description } = req.body;

    if (!name || !country) {
      return res.status(400).json({ message: "Name and Country are required" });
    }

    const newBrand = new Brand({
      name,
      country,
      foundedYear,
      logoUrl,
      description,
    });

    await newBrand.save();

    res.status(201).json({ message: "Brand added successfully", brand: newBrand });
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// app.get("/api/brands/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid Brand ID" });
//     }

//     const brand = await Brand.findById(id);
//     if (!brand) {
//       return res.status(404).json({ error: "Brand not found" });
//     }

//     res.json(brand);
//   } catch (error) {
//     console.error("Error fetching brand:", error);
//     res.status(500).json({ error: "Failed to load brand" });
//   }
// });


app.get("/api/brands/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate the brand ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Brand ID" });
    }

    // Find the brand by ID
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Generate full image URL if logo exists
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const updatedBrand = {
      ...brand._doc,
      logoUrl: brand.logoUrl ? `${baseUrl}/images/${brand.logoUrl}` : null,
    };

    res.json(updatedBrand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ error: "Failed to load brand" });
  }
});


// app.post("/api/brands/update/:id", upload.single("image"), async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate brand ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid Brand ID" });
//     }

//     // Extract data from request body
//     const { name, country, foundedYear, description } = req.body;

//     let updatedData = { name, country, foundedYear, description };

//     // If an image was uploaded, update the logoUrl
//     if (req.file) {
//       updatedData.logoUrl = `/images/${req.file.filename}`;
//     }

//     // Find and update the brand
//     const updatedBrand = await Brand.findByIdAndUpdate(id, updatedData, { new: true });

//     if (!updatedBrand) {
//       return res.status(404).json({ error: "Brand not found" });
//     }

//     res.json({ message: "Brand updated successfully!", brand: updatedBrand });
//   } catch (error) {
//     console.error("Error updating brand:", error);
//     res.status(500).json({ error: "Failed to update brand" });
//   }
// });

app.put("/api/brands/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Brand ID" });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json(updatedBrand);
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ error: "Failed to update brand" });
  }
});

app.delete("/api/brands/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid Brand ID" });
    }

    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ error: "Internal Server Error" });
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



app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST: Add a new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = new Category({
      name,
      description,
    });

    // Save the new category to the database
    await newCategory.save();
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// Server-side route
app.get('/api/category/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});




app.post('/api/category/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    // Get category ID from the request params
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    // Find and delete the category
    const category = await Category.findByIdAndDelete(id);

    // If no category is found, return a 404 error
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Return a success response
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
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

  try {
    const user = await User.findOne({ 
      username: username, 
      role: 'admin' 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Directly comparing passwords (no hashing)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
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

app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ 
      username: username, 
      role: 'client' 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Directly comparing passwords (no hashing)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
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
app.post("/api/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
      },
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post('/api/admin/user', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username, role: 'admin' });

    if (!user) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    res.json(user);
    console.log(user);
  } catch (error) {
    console.error("Error fetching AdminUser:", error);
    res.status(500).json({ error: "Failed to fetch AdminUser" });
  }
});
app.post('/api/client/user', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username, role: 'client' });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.json(user);
    console.log(user);
  } catch (error) {
    console.error("Error fetching User:", error);
    res.status(500).json({ error: "Failed to fetch User" });
  }
});


// app.post("/api/cart/add", async (req, res) => {
//   try {
//     const { userId, productId, name, price, quantity } = req.body;

//     let cart = await Cart.findOne({ customer: userId });

//     if (!cart) {
//       cart = new Cart({ customer: userId, cartItems: [] });
//     }

//     const existingItem = cart.cartItems.find((item) => item.product.toString() === productId);

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.cartItems.push({ product: productId, name, price, quantity });
//     }

//     await cart.save();
//     res.json({ message: "Product added to cart", cart });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     res.status(500).json({ message: "Failed to add product to cart" });
//   }
// });


app.post("/api/cart/add", async (req, res) => {
  try {
    const { customer, product, name, price, quantity } = req.body;

    // Ensure all required fields are provided
    if (!customer || !product || !name || !price || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the existing cart for the user
    let cart = await Cart.findOne({ customer });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({ customer, cartItems: [] });
    }

    // Ensure cartItems is always an array
    if (!cart.cartItems) {
      cart.cartItems = [];
    }

    // Check if the product already exists in the cart
    const existingItem = cart.cartItems.find((item) => item.product.toString() === product);

    if (existingItem) {
      existingItem.quantity += quantity; // Update quantity
    } else {
      cart.cartItems.push({ product, name, price, quantity }); // Add new item
    }

    // Save the updated cart
    await cart.save();
    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add product to cart", error });
  }
});



// Fetch Cart by User ID
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.params.userId });
    res.json(cart ?? { cartItems: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

// Add item to cart
app.post("/api/cart/add", async (req, res) => {
  try {
    const { customerId, productId, name, price, quantity } = req.body;

    let cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      cart = new Cart({ customer: customerId, cartItems: [] });
    }

    const existingItem = cart.cartItems.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.cartItems.push({ product: productId, name, price, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart", error });
  }
});

// Update Item Quantity
app.put("/api/cart/update/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { customer: userId, "cartItems.product": productId },
      { $set: { "cartItems.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart or product not found" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
});

// Remove Item
app.delete("/api/cart/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { customer: userId },
      { $pull: { cartItems: { product: productId } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart or product not found" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
});

// Clear Cart
app.delete("/api/cart/clear/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { customer: req.params.userId },
      { $set: { cartItems: [] } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
});




app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = req.file.filename; // Store only filename
  res.json({ imageUrl });
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
