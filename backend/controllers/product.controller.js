import Product from "../models/product.model.js";


// add product :/api/product/add-product
export const addProduct = async (req, res) => {
  try {
    const { name,description,  price, offerPrice, category } = req.body;
    const image = req.files?.map((file) => file.filename);

    if(
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !image ||
      image.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "All fields including images are required",
      })
    }

    await Product.create({
      name,
     description,
      price,
      offerPrice,
      category,
      image,
    });
        res.status(201).json({ message: "Product added successfully", success:true});
  } catch (error) {
    console.error("Error in addProduct:", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};




// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1});
    res.status(200).json({ products ,success: true});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    if (! product) {
        return res.status(404).json({ message:"Product not found",success: false});
    }
        res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};