const Product = require("../../models/E-commerce model/product");

// Create a new product
exports.createProduct = async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        discountPrice,
        inStock,
        quantity,
        tags,
        category,
        subcategory,
      } = req.body;
  
      // Validation
      if (!title || !price || !category) {
        return res.status(400).json({ error: "Title, price, and category are required" });
      }
  
      // Extract image paths
      const thumbnail = req.file ? req.file.path : null;
      const images = req.files ? req.files.map(file => file.path) : [];
  
      // Validate discount price
      if (discountPrice && discountPrice >= price) {
        return res.status(400).json({ error: "Discount price should be less than original price." });
      }
  
      // Ensure user data is available from token
      if (!req.user || !req.user.userId || !req.user.username) {
        return res.status(401).json({ error: "Username and id are required." });
      }
  
      const createdBy = {
        id: req.user.userId,
        username: req.user.username,
      };
  
      // Validate tags: Check if it's a string and convert to array if needed
      let parsedTags = [];
      if (tags) {
        try {
          // If tags is a valid JSON string (e.g., '["horror", "action"]')
          parsedTags = JSON.parse(tags);
        } catch (error) {
          // If tags is not a JSON string, treat it as a plain string (e.g., "horror")
          parsedTags = [tags];
        }
      }
  
      // Create the product
      const product = await Product.create({
        title,
        description,
        price,
        discountPrice,
        inStock,
        quantity,
        tags: parsedTags,  // Store the parsed tags as an array
        category,
        subcategory,
        thumbnail,
        images,
        createdBy,
      });
  
      res.status(201).json({
        message: "Product created successfully!",
        product,
      });
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
  };
  
  

// Get all products (with optional filters)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, search, tag } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (tag) filter.tags = tag;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
