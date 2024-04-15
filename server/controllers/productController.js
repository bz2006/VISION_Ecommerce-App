import Product from "../models/productModel.js";
import productModel from "../models/productModel.js";







export const getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        return res.status(200).json({product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const productList = await productModel.find({});
        if (!productList) {
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        return res.status(200).json({ productList });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const categoryId = req.params.id; 
        
        const productList = await productModel.find({ category: categoryId });
        
        if (!productList) {
            return res.status(404).json({ success: false, message: 'No products found for the specified category' });
        }
        
        return res.status(200).json({ success: true, productList });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



