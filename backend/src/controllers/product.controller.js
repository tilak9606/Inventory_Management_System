import Product from "../models/product.js";
import StockMovement from "../models/stockMovement.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ "getAllProducts error": err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ "getProductById error": err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ "createProduct error": err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ "updateProduct error": err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ "deleteProduct error": err.message });
  }
};

const addStock = async (req, res) => {
  const { amount, reason } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.quantity += amount;
    await product.save();
    await StockMovement.create({
      product: product._id,
      change: amount,
      reason,
    });

    res.json(product);
  } catch (err) {
    res.status(400).json({ "addStock error": err.message });
  }
};

const removeStock = async (req, res) => {
  const { amount, reason } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.quantity < amount)
      return res.status(400).json({ message: "Insufficient stock" });

    product.quantity -= amount;
    await product.save();
    await StockMovement.create({
      product: product._id,
      change: -amount,
      reason,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ "removeStock error": err.message });
  }
};

const getLowStock = async (req, res) => {
  try {
    const products = await Product.find({ $expr: { $lte: ["$quantity", "$low_stock_threshold"] } }).sort({ quantity: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ "getLowStock error": err.message });
  }
};

export {
  getAllProducts, 
  getProductById,
  createProduct, 
  updateProduct, 
  deleteProduct, 
  addStock, 
  removeStock,
  getLowStock
}