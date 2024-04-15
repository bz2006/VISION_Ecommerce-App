import express from "express";
import { getSingleProduct, getAllProducts, getProducts
} from "../controllers/productController.js";
import {  requireSignup } from "../middlewares/authMiddleware.js";


const router = express.Router();



//get all products for shopPage
router.get("/shop-products", getAllProducts);

router.get("/cat-products/:id", getProducts);




//get single product Page
router.get("/product-page/:id", getSingleProduct);



export default router;