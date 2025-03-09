const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { ObjectId } = require('mongodb');
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
const Feedback = require('./models/Feedback');
const Accessory = require('./models/Accessory')
const path = require('path');
const nodemailer = require("nodemailer");
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



  // app.use('/images', express.static('images'));
  app.use('/images', express.static(path.join(__dirname, 'images')));
  // app.use('/images/aadhar', express.static(path.join(__dirname, 'images')));


  const storage = multer.diskStorage({
    destination: "./images/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });


  

  const upload = multer({ storage });
  // const uploadAadhar = multer({ storage: aadharImageStorage });

app.get('/', (req, res) => {
  res.send("Hello");
});

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


app.get('/api/getproducts/:catname', async (req, res) => {
  try {
    const { catname } = req.params; // Fetch category name from query params
    console.log(catname);
    
    if (!catname) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Fetch products that match the category
    const products = await Product.find({ category: catname });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    const updatedProducts = products.map(product => ({
      ...product._doc,
      imageUrl: `${baseUrl}/images/${product.imageUrl}`, // Construct full image URL
    }));

    res.json(updatedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});





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
        profilePicture: user.profilePicture,
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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'nisarglimbachiya028@gmail.com', // Replace with your email
        pass: 'axeptrcseciqqdbf' // Replace with your email password or app password
      }
    });

    const mailOptions = {
      from: 'nisarglimbachiya028@gmail.com',
      to: user.email, // Send email to the registered user
      subject: 'LogIn successful',
      html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
      <h1 style="color: #333;">Welcome, ${user.firstName}!</h1>
      <p style="font-size: 16px; color: #555;">Your Login was successful.</p>
    </div>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.post("/api/register", upload.fields([{ name: 'aadharFront', maxCount: 1 }, { name: 'aadharBack', maxCount: 1 }]), async (req, res) => {
 
  try {
//     console.log('Processed Body:', JSON.stringify(req.body, null, 2));
// console.log('Office Address:', req.body.officeAddress);
// console.log('Residential Address:', req.body.address);
    
    // if (!req.body.officeAddress) {
    //   return res.status(400).json({ error: "Office address is required." });
    // }
    // // Check if residential address is provided
    // if (!req.body.address) {
    //   return res.status(400).json({ error: "Residential address is required." });
    // }
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,  // Now securely hashed
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dob: new Date(req.body.dob), // Ensure date format is correct
      gender: req.body.gender, // Ensure date format is correct
      phoneNumber: req.body.phoneNumber,
      designation: req.body.designation,
      jobProfile: req.body.jobProfile,
      orgName: req.body.orgName,
      officeAddress: {
        officeBuilding: req.body['officeAddress.officeBuilding'],
        officeStreet: req.body['officeAddress.officeStreet'],
        officeCity: req.body['officeAddress.officeCity'],
        officeState: req.body['officeAddress.officeState'],
        officePinCode: req.body['officeAddress.officePinCode']
      },
      email: req.body.email,
      
      address: {
        building: req.body['address.building'],
        street: req.body['address.street'],
        city: req.body['address.city'],
        state: req.body['address.state'],
        pinCode: req.body['address.pinCode']
      },    
      aadharNumber: req.body.aadharNumber,
      aadharFront: req.files['aadharFront'] ? req.files['aadharFront'][0].filename : null,
      aadharBack: req.files['aadharBack'] ? req.files['aadharBack'][0].filename : null,
      role: 'client'
    });
    

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'nisarglimbachiya028@gmail.com', // Replace with your email
        pass: 'axeptrcseciqqdbf' // Replace with your email password or app password
      }
    });

    const mailOptions = {
      from: 'nisarglimbachiya028l@gmail.com',
      to: req.body.email, // Send email to the registered user
      subject: 'Welcome to Our PC-World!',
      html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
      <h1 style="color: #333;">Welcome, ${req.body.firstName}!</h1>
      <p style="font-size: 16px; color: #555;">Your registration was successful.</p>
      <p style="font-size: 16px; color: #333;"><strong>Username:</strong> ${req.body.username}</p>
      <p style="font-size: 16px; color: #555;">Thank you for registering with us.</p>
    </div>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });


    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Username, email, or Aadhar number already exists." });
    } else {
      console.error(error);
      res.status(500).json({ error: "Error registering user" });
    }
  }
});


app.post('/api/uploadAadhar', upload.fields([{ name: 'aadharFront', maxCount: 1 }, { name: 'aadharBack', maxCount: 1 }]), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  console.log('Files:', req.files); // Debugging
  console.log('Body:', req.body); // Debugging

  res.json({
    aadharFront: req.files['aadharFront'] ? req.files['aadharFront'][0].filename : null,
    aadharBack: req.files['aadharBack'] ? req.files['aadharBack'][0].filename : null,
  });
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
// app.post('/api/client/user', async (req, res) => {
//   try {
//     const { username } = req.body;
//     console.log(username);
    

//     if (!username) {
//       return res.status(400).json({ error: "Username is required" });
//     }

//     const user = await User.findOne({ username, role: 'client' });

//     if (!user) {
//       return res.status(404).json({ error: "user not found" });
//     }

//     res.json(user);
//     console.log(user);
//   } catch (error) {
//     console.error("Error fetching User:", error);
//     res.status(500).json({ error: "Failed to fetch User" });
//   }
// });

app.post('/api/client/user', async (req, res) => {
  try {
    const { username } = req.body;
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username, role: 'client' }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create new object with image URLs
    const userWithImages = {
      ...user,
      aadharFront: user.aadharFront ? `${baseUrl}/images/${user.aadharFront}` : null,
      aadharBack: user.aadharBack ? `${baseUrl}/images/${user.aadharBack}` : null
    };

    res.json(userWithImages);

  } catch (error) {
    console.error("Error fetching User:", error);
    res.status(500).json({ error: "Failed to fetch User" });
  }
});




app.post("/api/cart/add", async (req, res) => {
  try {
    const { customerId, productId, name, price, quantity, imageUrl } = req.body;
    
    
    let cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      cart = new Cart({ customer: customerId, cartItems: [] });
    }

    const existingItem = cart.cartItems.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.cartItems.push({ product: productId, name, price, quantity, imageUrl });
    }

    await cart.save();
    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
});


// Fetch Cart by User ID
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.params.userId }).populate("cartItems.product");

    if (!cart) {
      return res.json({ cartItems: [] });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Map cart items to include the full image URL
    const updatedCartItems = cart.cartItems.map(item => ({
      ...item._doc,
      product: {
        ...item.product._doc,
        imageUrl: `${baseUrl}/images/${item.product.imageUrl}`
      }
    }));

    res.json({ cartItems: updatedCartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
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

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// app.put('/api/users/:userId', upload.fields([{ name: 'aadharFront', maxCount: 1 }, { name: 'aadharBack', maxCount: 1 }]), async (req, res) => {
//   const { userId } = req.params;
//   const fromData = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update user fields
//     Object.keys(fromData).forEach((key) => {
//       if (key === 'address') {fromData
//         user[key] = JSON.parse(fromData[key]); // Parse address if it's a string
//       } else {
//         user[key] = fromData[key];
//       }
//     });

//     // Update profile picture if a new file is uploaded
//     if (req.file) {
//       user.profilePicture = req.file.filename;
//     }

//     await user.save();

//     // Return the updated user object
//     res.status(200).json({ message: 'User updated successfully', user });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ message: 'Error updating user data', error: err.message });
//   }
// });

app.put('/api/users/:userId', upload.fields([
  { name: 'aadharFront', maxCount: 1 }, 
  { name: 'aadharBack', maxCount: 1 }
]), async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle nested address fields
    const addressFields = ['building', 'street', 'city', 'state', 'pinCode'];
    const officeAddressFields = ['officeBuilding', 'officeStreet', 'officeCity', 'officeState', 'officePinCode'];

    // Update regular fields
    Object.keys(req.body).forEach(key => {
      if (user[key] !== undefined && !key.startsWith('address.') && !key.startsWith('officeAddress.')) {
        user[key] = req.body[key];
      }
    });

    // Update address
    addressFields.forEach(field => {
      const key = `address.${field}`;
      if (req.body[key] !== undefined) {
        user.address[field] = req.body[key];
      }
    });

    // Update officeAddress
    officeAddressFields.forEach(field => {
      const key = `officeAddress.${field}`;
      if (req.body[key] !== undefined) {
        user.officeAddress[field] = req.body[key];
      }
    });

    // Handle file updates
    if (req.files) {
      if (req.files['aadharFront']) {
        user.aadharFront = req.files['aadharFront'][0].filename;
      }
      if (req.files['aadharBack']) {
        user.aadharBack = req.files['aadharBack'][0].filename;
      }
    }

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: 'Error updating user data', error: err.message });
  }
});

// DELETE API to delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  console.log("Deleting user with ID:", req.params.id);  // Log user ID
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId );
    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});






app.get('/api/users/:id', async (req, res) => {
  try {
    const {id} = req.params;
    // console.log("Deleting user with ID:", req.params.id);
    
    // Find user by ID
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.put('/api/users/:userId', upload.single('image'), async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email, phone, department, gender, dateOfBirth, isActive, isDeleted, role, address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.isActive = isActive !== undefined ? isActive === 'true' : user.isActive;
    user.isDeleted = isDeleted !== undefined ? isDeleted === 'false' : user.isDeleted;

    // Update address if provided
    if (address) {
      user.address = JSON.parse(address); // Parse the address string back into an array
    }

    // Update profile picture if uploaded
    if (req.file) {
      user.profilePicture = req.file.filename;
    }

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: 'Error updating user data', error: err.message });
  }
});



app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });

    
  }
  console.log('File:', req.file); // Check the file
  console.log('Body:', req.body); // Check other form data
  const imageUrl = req.file.filename; // The filename is stored in `req.file.filename`
  res.json({ imageUrl });
});
;


// fedback APIs start


app.post('/api/feedback-in', async (req, res) => {
  try {
    const { userId, productId, productTitle, title, description } = req.body;

    // Validate input
    if (!userId || !productId || !productTitle || !title || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new feedback document
    const newFeedback = new Feedback({
      userId,
      productId,
      productTitle,
      title,
      description
    });

    // Save to database
    await newFeedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});



app.post('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({isActive: true});
    return res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server error" });
  }
})


app.get('/api/approved-feedbacks/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    const objectId = new mongoose.Types.ObjectId(productId);
    const feedbacks = await Feedback.find({ productId: objectId, status: "approved" });

    if (!feedbacks.length) {
      return res.status(404).json({ message: "No approved feedbacks found for this product." });
    }

    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
;

app.get("/api/feedbacks/pending", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isActive: false })
      .populate("userId", "username")
      .populate("productId", "title");

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending feedbacks", details: error.message });
  }
});



app.put("/api/feedbacks/approve/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback approved successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: "Error approving feedback", details: error.message });
  }

});

app.delete("/api/feedbacks/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting feedback", details: error.message });
  }
});


app.put("/api/feedbacks/:id/disapprove", async (req, res) => {
  try {
    const { id } = req.params;

    // Update isActive to false
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback disapproved successfully", feedback: updatedFeedback });
  } catch (error) {
    console.error("Error disapproving feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// feedback APIs end

// accessory APIs start
app.post('/accessories',  async (req, res) => {
   
    try {
      const accessory = await Accessory.find();
      res.json(accessory)
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// READ - Get all accessories (with filtering)
app.get('/accessories', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, brand } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const accessories = await Accessory.find(filter)
      .populate('brand', 'name')
      .skip(skip)
      .limit(limit);

    const total = await Accessory.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      accessories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/accessories', async (req, res) => {
  try {
    console.log('Received Data:', req.body.formData); // Log the received data

    const accessory = new Accessory(req.body.fromData);
    const savedAccessory = await accessory.save();

    console.log('Saved to DB:', savedAccessory); // Log the saved data
    res.status(201).json(savedAccessory);
  } catch (error) {
    console.error('Error:', error.message); // Log the error
    res.status(500).json({ message: error.message });
  }
});
// READ - Get single accessory
app.get('/accessories/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id)
      .populate('brand', 'name logo');
      
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' });
    }
    res.json(accessory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - Update accessory
app.put('/accessories/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' });
    }
    res.json(accessory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete accessory
app.delete('/accessories/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndDelete(req.params.id);
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' });
    }
    res.json({ message: 'Accessory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// accessory APIs end


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
