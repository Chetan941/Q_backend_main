const Product = require("../models/Product");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Add a product to a firm
const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id
    });

    const savedProduct = await product.save();
    firm.products.push(savedProduct._id);
    await firm.save();

    return res.status(200).json(savedProduct);

  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get products for a firm
const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    const products = await Product.find({ firm: firmId });
    return res.status(200).json({
      restaurantName: firm.firmName,
      products
    });

  } catch (error) {
    console.error("Error in getProductByFirm:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete product by ID
const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Error in deleteProductById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductById
};
