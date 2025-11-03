import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    change: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.StockMovement || mongoose.model("StockMovement", stockMovementSchema);
