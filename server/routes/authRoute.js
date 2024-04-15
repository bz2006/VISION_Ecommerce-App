import express from "express";
import { signupcontroller, logincontroller } from "../controllers/authcontroller.js"
import { requireSignup } from "../middlewares/authMiddleware.js"
const router = express.Router()


router.post("/signup", signupcontroller)


router.post("/login", logincontroller)


router.get("/user-auth", requireSignup, (req, res) => {
    res.status(200).send({ ok: true });
  });




export default router