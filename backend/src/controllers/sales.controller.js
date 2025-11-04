import Product from "../models/product.js";
import Sale from "../models/sale.js";
import StockMovement from "../models/stockMovement.js";

const createSale = async (req, res) => {
  const { product_id, quantity } = req.body;

  try {
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.quantity < quantity) return res.status(400).json({ message: "Insufficient stock" });

    const unit_price = product.selling_price;
    const total_amount = unit_price * quantity;

    product.quantity -= quantity;
    await product.save();

    const sale = await Sale.create({
      product: product._id,
      quantity,
      unit_price,
      total_amount,
    });

    await StockMovement.create({
      product: product._id,
      change: -quantity,
      reason: "sale",
    });

    res.status(201).json({ sale, product });
  } catch (err) {
    res.status(400).json({ "createSale error": err.message });
  }
};

const listSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("product").sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ "listSales error": err.message });
  }
};

export {createSale, listSales}