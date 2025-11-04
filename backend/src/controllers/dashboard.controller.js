import Product from "../models/product.js";
import Sale from "../models/sale.js";

const getOverview = async (req, res) => {
  try {
    const products = await Product.find();
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + p.quantity * p.cost_price,
      0
    );

    const lowStockCount = products.filter(
      (p) => p.quantity <= p.low_stock_threshold
    ).length;

    const topSelling = await Sale.aggregate([
      { $group: 
        { _id: "$product", 
          totalSold: { $sum: "$quantity" } 
        } 
      },
      { $sort: { 
        totalSold: -1 
        } 
      },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
    ]);

    const salesAgg = await Sale.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$total_amount" } } },
    ]);
    const totalSales = salesAgg[0]?.totalSales || 0;

    res.json({ totalInventoryValue, lowStockCount, topSelling, totalSales });
  } catch (err) {
    res.status(500).json({ "getOverview error": err.message });
  }
};

export {getOverview}