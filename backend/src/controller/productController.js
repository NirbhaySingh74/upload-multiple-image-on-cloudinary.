import Product from "../models/Product.js";

export const uploadProduct = async (req, res) => {
  try {
    const { name, description, price, images } = req.body;

    const product = new Product({
      name,
      description,
      price,
      images,
    });

    await product.save();

    res.status(200).json({ message: "Product uploaded successfully", product });
  } catch (error) {
    console.error("Error uploading product:", error);
    res.status(500).json({ message: "Product upload failed", error });
  }
};
