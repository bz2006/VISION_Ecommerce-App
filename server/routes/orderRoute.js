import express from "express";
import { createOrder,getOrdersByUserId ,getOrdersByorderId} from "../controllers/orderController.js";
import { requireSignup } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.post(
    "/create-order",
    requireSignup,createOrder
  
  );
  router.get(
    "/user-order/:id",
    requireSignup,getOrdersByorderId
  
  );

  router.get(
    "/get-orders/:id",
    requireSignup,getOrdersByUserId
  
  );


  



  export default router;