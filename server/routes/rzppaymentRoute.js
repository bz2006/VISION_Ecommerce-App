import express from 'express';
import { createOrder,capturePayment } from '../middlewares/rzppaymentMiddleware.js';

const router = express.Router();

// Route to create a Razorpay order
router.post("/create-order", createOrder, (req, res) => {
  res.json(req.order); // Send created order as response
});

// Route to capture payment
router.post("/payment-capture", capturePayment, (req, res) => {
  res.json(req.payment); 
});

export default router;
