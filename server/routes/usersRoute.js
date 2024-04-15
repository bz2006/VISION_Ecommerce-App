import express from "express";
import { Forgotpass, UpdatePass, getUserById, updateUsername, useraddress } from "../controllers/usersController.js";
import {requireSignup } from "../middlewares/authMiddleware.js";
import { 
  getalladdress, 
  setDefaultadrs,
  updateuseraddress,
  deleteuseraddress,
  updateUserOrdersno} from "../controllers/usersController.js";
  import { categoryControlller } from "../controllers/categoryController.js";


const router = express.Router();


// User Routes ----------------------------------
router.get("/get-user/:id", getUserById);

router.post("/update-username/:id", updateUsername);

router.post("/update-pass/:id", UpdatePass);

router.post("/forgot-pass/:email", Forgotpass);


router.post(
  "/update-user/:id",
  requireSignup,useraddress

);

router.put(
  "/update-user-adrs/:id",
  requireSignup,updateuseraddress

);

router.get("/get-category",  categoryControlller);


router.put(
  "/user_ordersno/:id",
  requireSignup,updateUserOrdersno

);

router.post(
  "/delete-user-adrs/:id",
  requireSignup,deleteuseraddress

);

// //get single products
router.get("/getall-address/:id", requireSignup, getalladdress);

router.post(
  "/user-def-adres/:id",
  requireSignup,setDefaultadrs

);






export default router;