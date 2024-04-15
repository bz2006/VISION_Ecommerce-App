import express from "express";
import { createOrUpdateCart,getCartsByUserId ,deleteCart} from "./../controllers/cartController.js";

const router = express.Router();



//update category
router.put(
  "/create-up-cart/:id",
  createOrUpdateCart
);

//get cart
router.get("/get-cart/:id",getCartsByUserId);



//delete category
router.delete(
  "/delete-cart/:id",
  deleteCart
);

export default router;