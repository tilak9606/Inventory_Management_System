import express from "express";
import * as dashCtrl from "../controllers/dashboard.controller.js";
import * as productCtrl from "../controllers/product.controller.js";
import * as saleCtrl from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/products", productCtrl.getAllProducts);
router.get("/products/low-stock", productCtrl.getLowStock);
router.get("/products/:id", productCtrl.getProductById);
router.post("/products", productCtrl.createProduct);
router.put("/products/:id", productCtrl.updateProduct);
router.delete("/products/:id", productCtrl.deleteProduct);

router.post("/products/:id/add-stock", productCtrl.addStock);
router.post("/products/:id/remove-stock", productCtrl.removeStock);

router.get("/sales", saleCtrl.listSales);
router.post("/sales", saleCtrl.createSale);

router.get("/dashboard/overview", dashCtrl.getOverview);

export default router;
